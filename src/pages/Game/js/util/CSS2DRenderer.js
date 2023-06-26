/**
 * @author mrdoob / http://mrdoob.com/
 *
 * adapted for bluemap's purposes
 */

import {
    Matrix4,
    Object3D, Vector2,
    Vector3
} from "three";
import {dispatchEvent} from "./Utils";

class CSS2DObject extends Object3D {

    constructor(element) {
        super();

        this.element = document.createElement("div");
        let parent = element.parentNode;
        parent.replaceChild(this.element, element);
        this.element.appendChild(element);

        this.element.style.position = 'absolute';

        this.anchor = new Vector2();

        this.events = null;

        this.addEventListener('removed', function () {

            this.traverse(function (object) {

                if (object.element instanceof Element && object.element.parentNode !== null) {

                    object.element.parentNode.removeChild(object.element);

                }

            });

        });

        let lastClick = -1;
        let handleClick = event => {
            let doubleTap = false;

            let now = Date.now();
            if (now - lastClick < 500) {
                doubleTap = true;
            }

            lastClick = now;

            let data = {doubleTap: doubleTap};

            if (this.onClick({event: event, data: data})) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // fire event
                dispatchEvent(this.events, "bluemapMapInteraction", {
                    data: data,
                    object: this,
                });
            }
        }

        this.element.addEventListener("click", handleClick);
        this.element.addEventListener("touch", handleClick);
    }

}

//

let CSS2DRenderer = function (events = null) {

    let _this = this;

    let _width, _height;
    let _widthHalf, _heightHalf;

    let vector = new Vector3();
    let viewMatrix = new Matrix4();
    let viewProjectionMatrix = new Matrix4();

    let cache = {
        objects: new WeakMap()
    };

    let domElement = document.createElement( 'div' );
    domElement.style.overflow = 'hidden';

    this.domElement = domElement;

    this.events = events;

    this.getSize = function () {

        return {
            width: _width,
            height: _height
        };

    };

    this.setSize = function ( width, height ) {

        _width = width;
        _height = height;

        _widthHalf = _width / 2;
        _heightHalf = _height / 2;

        domElement.style.width = width + 'px';
        domElement.style.height = height + 'px';

    };

    let renderObject = function ( object, scene, camera, parentVisible ) {

        if ( object instanceof CSS2DObject ) {

            object.events = _this.events;

            object.onBeforeRender( _this, scene, camera );

            vector.setFromMatrixPosition( object.matrixWorld );
            vector.applyMatrix4( viewProjectionMatrix );

            let element = object.element;
            let style = 'translate(' + ( vector.x * _widthHalf + _widthHalf - object.anchor.x) + 'px,' + ( - vector.y * _heightHalf + _heightHalf - object.anchor.y ) + 'px)';

            element.style.WebkitTransform = style;
            element.style.MozTransform = style;
            element.style.oTransform = style;
            element.style.transform = style;

            element.style.display = ( parentVisible && object.visible && vector.z >= - 1 && vector.z <= 1 && element.style.opacity !== "0" ) ? '' : 'none';

            let objectData = {
                distanceToCameraSquared: getDistanceToSquared( camera, object )
            };

            cache.objects.set( object, objectData );

            if ( element.parentNode !== domElement ) {

                domElement.appendChild( element );

            }

            object.onAfterRender( _this, scene, camera );

        }

        for (let i = 0, l = object.children.length; i < l; i ++ ) {

            renderObject( object.children[ i ], scene, camera, parentVisible && object.visible );

        }

    };

    let getDistanceToSquared = function () {

        let a = new Vector3();
        let b = new Vector3();

        return function ( object1, object2 ) {

            a.setFromMatrixPosition( object1.matrixWorld );
            b.setFromMatrixPosition( object2.matrixWorld );

            return a.distanceToSquared( b );

        };

    }();

    let filterAndFlatten = function ( scene ) {

        let result = [];

        scene.traverse( function ( object ) {

            if ( object instanceof CSS2DObject ) result.push( object );

        } );

        return result;

    };

    let zOrder = function ( scene ) {

        let sorted = filterAndFlatten( scene ).sort( function ( a, b ) {

            let distanceA = cache.objects.get( a ).distanceToCameraSquared;
            let distanceB = cache.objects.get( b ).distanceToCameraSquared;

            return distanceA - distanceB;

        } );

        let zMax = sorted.length;

        for (let i = 0, l = sorted.length; i < l; i ++ ) {

            sorted[ i ].element.style.zIndex = zMax - i;

        }

    };

    this.render = function ( scene, camera ) {

        if ( scene.matrixWorldAutoUpdate === true ) scene.updateMatrixWorld();
        if ( camera.parent === null ) camera.updateMatrixWorld();

        viewMatrix.copy( camera.matrixWorldInverse );
        viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, viewMatrix );

        renderObject( scene, scene, camera, true );
        zOrder( scene );

    };

};

export { CSS2DObject, CSS2DRenderer };