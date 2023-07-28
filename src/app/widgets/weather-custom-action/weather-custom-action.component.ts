import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WeatherWidgetComponent } from "../weather-widget/weather-widget.component";

@Component({
  selector: "app-weather-custom-action",
  standalone: true,
  imports: [CommonModule],
  template: `<button (click)="onClick()">Reload & Copy</button>`,
  styles: [],
})
export class WeatherCustomActionComponent {
  /**
   * This will not work just like that. The instance of this component is declared in the app.component, so the parent injector
   * will be the injector of the app.component. But the "providers" array of the app.component isn't containing tbe WeatherWidgetComponent,
   * so this injection will throw an error.
   *
   * How can we fix this?
   *
   * We are passing a template with the <app-weather-custom-action> component from app.component
   * to the weather-widget component. Then we are using this template in the weather-widget component using the
   * [ngTemplateOutlet] directive. And here we can define an another directive, the [ngTemplateOutletInjector], where
   * we can pass an injector to the particular template. (The injector is more or less a "providers" array, so it contains all the
   * components, services, etc., which we want to inject in some place.) So we just pass the injector of the weather-widget component
   * into the [ngTemplateOutletInjector] directive. The weather-widget component has no "providers" array defined by us, but under the hood every component
   * has a "providers" array which looks like this:
   *
   * [{
   *   provide: WeatherWidgetComponent,
   *   useClass: WeatherWidgetComponent,
   * }]
   *
   * So if we pass that local injector to the [ngTemplateOutletInjector] directive, we will technically pass this array to the
   * template, which will mean, that all the things in the template, which are capable to some dependency injection, will have this "providers" array. (If the component
   * has an own "providers" array too, it will be merged with the passed injector).
   *
   * So now this component will know about the WeatherWidgetComponent, so the inject(WeatherWidgetComponent) will no longer
   * throw an error.
   */
  weatherWidget = inject(WeatherWidgetComponent);

  onClick() {
    this.weatherWidget.actions.reload();
    this.weatherWidget.actions.copyData();
  }
}
