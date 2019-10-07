/***************************************************************************************
 * Made for the {N} community by Brad Martin @BradWayneMartin
 * https://twitter.com/BradWayneMartin
 * https://github.com/bradmartin
 * http://bradmartin.net
 *************************************************************************************/

import { Color } from "tns-core-modules/color";
import { Property } from "tns-core-modules/ui/core/properties";
import { ContentView } from "tns-core-modules/ui/content-view";

export abstract class Ripple extends ContentView {
  protected rippleColor: Color = null;

  public abstract performRipple(x: number, y: number);
}

export const rippleColorProperty = new Property<Ripple, Color>({
  name: "rippleColor",
  equalityComparer: Color.equals,
  valueConverter: v => new Color(v)
});
rippleColorProperty.register(Ripple);

export const rippleAlphaProperty = new Property<Ripple, number>({
  name: "rippleAlpha",
  affectsLayout: true
});
rippleAlphaProperty.register(Ripple);

export const rippleDurationProperty = new Property<Ripple, number>({
  name: "rippleDuration",
  affectsLayout: true
});
rippleDurationProperty.register(Ripple);

export const fadeDurationProperty = new Property<Ripple, string>({
  name: "fadeDuration",
  affectsLayout: true
});
fadeDurationProperty.register(Ripple);

export const rippleBorderRadiusProperty = new Property<Ripple, number>({
  name: "rippleBorderRadius",
  affectsLayout: true
});
rippleBorderRadiusProperty.register(Ripple);

export const rippleDelayClickProperty = new Property<Ripple, boolean>({
  name: "rippleDelayClick",
  affectsLayout: true
});
rippleDelayClickProperty.register(Ripple);
