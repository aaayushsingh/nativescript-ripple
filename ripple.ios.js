"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("tns-core-modules/color");
var gestures_1 = require("tns-core-modules/ui/gestures");
var common = require("./ripple-common");
var AnimationDelegate = (function (_super) {
    __extends(AnimationDelegate, _super);
    function AnimationDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimationDelegate.new = function () {
        return _super.new.call(this);
    };
    AnimationDelegate.prototype.initWithCallbacks = function (animationDidStartCallback, animationDidStopFinishedCallback) {
        this.animationDidStartCallback = animationDidStartCallback;
        this.animationDidStopFinishedCallback = animationDidStopFinishedCallback;
        return this;
    };
    AnimationDelegate.prototype.animationDidStopFinished = function (anim, flag) {
        if (this.animationDidStopFinishedCallback) {
            this.animationDidStopFinishedCallback(anim, flag);
        }
    };
    AnimationDelegate.prototype.animationDidStart = function (anim) {
        if (this.animationDidStartCallback) {
            this.animationDidStartCallback(anim);
        }
    };
    AnimationDelegate.ObjCProtocols = [CAAnimationDelegate];
    return AnimationDelegate;
}(NSObject));
var Ripple = (function (_super) {
    __extends(Ripple, _super);
    function Ripple() {
        return _super.call(this) || this;
    }
    Ripple.prototype.performRipple = function (x, y) {
        this.createRipple(x, y);
        this.finishRipple();
    };
    Ripple.prototype.updateRipple = function (x, y, action) {
        if (action === "down") {
            this.startRipple(x, y);
        }
        else if (action === "move" && this.ripple) {
            this.moveRipple(x, y);
        }
        else if (action === "up") {
            this.finishRipple();
        }
    };
    Ripple.prototype.createRipple = function (x, y) {
        var nativeView = this.ios;
        var size = this.getActualSize();
        var longestSide = Math.max(size.height, size.width);
        var initialRadius = longestSide * 2.5;
        this.ripple = UIView.alloc().initWithFrame(CGRectMake(0, 0, initialRadius, initialRadius));
        this.rippleIsFullyExtended = false;
        this.ripple.layer.cornerRadius = initialRadius * 0.5;
        this.ripple.backgroundColor = new color_1.Color(this.rippleColor
            ? this.rippleColor.hex
            : "#cecece").ios;
        this.ripple.alpha = 0.5;
        this.ripple.layer.transform = CATransform3DScale(CATransform3DIdentity, 0.1, 0.1, 0);
        nativeView.insertSubviewAtIndex(this.ripple, 1);
        this.ripple.center = CGPointMake(x || 0, y || 0);
    };
    Ripple.prototype.startRipple = function (x, y) {
        var _this = this;
        this.createRipple(x, y);
        this.animateScaleRipple(0.1, 1, 2.5, function (anim, flag) {
            _this.rippleIsFullyExtended = true;
        });
    };
    Ripple.prototype.moveRipple = function (x, y) {
        if (this.ripple) {
            var size = this.getActualSize();
            if (x < 0 || x > size.width || y < 0 || y > size.height) {
                this.finishRipple();
                return;
            }
            this.ripple.center = CGPointMake(x, y);
        }
    };
    Ripple.prototype.finishRipple = function () {
        if (this.ripple) {
            var presentationLayer = this.ripple.layer.presentationLayer();
            if (presentationLayer !== null) {
                var currentScale = presentationLayer.valueForKeyPath("transform.scale");
                this.cancelScaleRippleAnimation();
                var currentRipple_1 = this.ripple;
                if (!this.rippleIsFullyExtended) {
                    this.animateScaleRipple(currentScale, 1, 0.5);
                    this.animateFadeRipple(0.5, 0, 0.5, 0.2, function (anim, flag) {
                        currentRipple_1.removeFromSuperview();
                    });
                }
                else {
                    this.animateFadeRipple(0.5, 0, 0.5, 0, function (anim, flag) {
                        currentRipple_1.removeFromSuperview();
                    });
                }
                this.ripple = null;
            }
        }
    };
    Ripple.prototype.animateScaleRipple = function (fromScale, toScale, duration, animationDidStopFinishedCallback, animationDidStartCallback) {
        if (animationDidStopFinishedCallback === void 0) { animationDidStopFinishedCallback = function (anim, flag) { }; }
        if (animationDidStartCallback === void 0) { animationDidStartCallback = function (anim) { }; }
        var scaleAnimation = CABasicAnimation.animationWithKeyPath("transform.scale");
        scaleAnimation.fromValue = fromScale;
        scaleAnimation.toValue = toScale;
        scaleAnimation.timingFunction = CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseOut);
        scaleAnimation.duration = duration;
        scaleAnimation.delegate = new AnimationDelegate().initWithCallbacks(animationDidStartCallback, animationDidStopFinishedCallback);
        this.ripple.layer.transform = CATransform3DScale(CATransform3DIdentity, toScale, toScale, 0);
        this.ripple.layer.addAnimationForKey(scaleAnimation, "scale");
    };
    Ripple.prototype.cancelScaleRippleAnimation = function () {
        this.ripple.layer.removeAnimationForKey("scale");
    };
    Ripple.prototype.animateFadeRipple = function (fromAlpha, toAlpha, duration, delay, animationDidStopFinishedCallback, animationDidStartCallback) {
        if (animationDidStopFinishedCallback === void 0) { animationDidStopFinishedCallback = function (anim, flag) { }; }
        if (animationDidStartCallback === void 0) { animationDidStartCallback = function (anim) { }; }
        var fadeAnimation = CABasicAnimation.animationWithKeyPath("opacity");
        fadeAnimation.fromValue = fromAlpha;
        fadeAnimation.toValue = toAlpha;
        if (delay > 0) {
            fadeAnimation.beginTime = CACurrentMediaTime() + delay;
        }
        fadeAnimation.timingFunction = CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseOut);
        fadeAnimation.duration = duration;
        var ripple = this.ripple;
        fadeAnimation.delegate = new AnimationDelegate().initWithCallbacks(function (anim) {
            ripple.layer.opacity = 0;
        }, animationDidStopFinishedCallback);
        this.ripple.layer.addAnimationForKey(fadeAnimation, "fade");
    };
    Ripple.prototype.cancelFadeRippleAnimation = function () {
        this.ripple.layer.removeAnimationForKey("fade");
    };
    Ripple.prototype.onLoaded = function () {
        var _this = this;
        _super.prototype.onLoaded.call(this);
        var nativeView = this.ios;
        nativeView.clipsToBounds = true;
        this.tapFn = function (args) {
            _this.updateRipple(args.getX(), args.getY(), args.action);
        };
        this.on(gestures_1.GestureTypes.touch, this.tapFn);
    };
    Ripple.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        this.off(gestures_1.GestureTypes.touch, this.tapFn);
    };
    return Ripple;
}(common.Ripple));
exports.Ripple = Ripple;
