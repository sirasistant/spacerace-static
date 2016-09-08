Countdown = angular.module('Countdown', []);



Countdown.controller('CountdownController',['$scope','$timeout',function($scope,$timeout){
	$scope.startCountdown=function(clock){
			clock.setCountdown(true);
			var now = new Date();
			var startDate = new Date(2017, 0, 08, 0, 0, 0, 0);
			var dif = now.getTime() - startDate.getTime();
			var secs = Math.abs(dif / 1000);

			clock.setTime(secs);
	}
}]);

Countdown.directive('flipClock', ['$parse','$timeout', function($parse,$timeout) {
    return {
      replace: true,
      template: '<div></div>',
      restrict: 'E',
      link: function(scope, element, attr) {
        var optionKeys = [
          'autostart', //(boolean) If this is set to false, the clock will not auto start. The default value is true.
          'countdown', //(boolean) If this is set to true, the clock will count down instead of up. The default value is false.
          'callbacks', //(object) An object of callback functions that are triggered at various times. For more information, view the callback documentation.
          'classes',   //(object) This is an object of CSS classes to use to append to DOM objects
          'clockFace', // (string) This is the name of the clock that is used to build the clock display. The default value is HourlyCounter.
          'defaultclockface', //(string) This is the default clock face to use if the defined clock face does not exist. The default value is HourlyCounter.
          'defaultlanguage' //(string) This is the default langauge to use. The default value is english.
        ], options = {
          callbacks: {}
        },
          clock,
          methods = [
            'start', //This method will start the clock just call the .start() method on an FlipClock object.
            'stop',  // This method will stop the clock just call the .stop() method on an FlipClock object.
            'setTime', //This method will set the clock time after it has been instantiated just call the .setTime() method on an FlipClock object.
            'setCountdown', //This method will change the clock from counting up or down.
            'getTime' //To get the clock time after it has been instantiated just call the .getTime() method on an FlipClock object.
          ],
          callbacks = [
            'destroy', //This callback is triggered when the timer is destroyed
            'create', // This callback is triggered when the clock face is created
            'init', //This callback is triggered when the FlipClock object is initialized
            'interval', //This callback is triggered with each interval of the timer
            'start', //This callback is triggered when the clock is started
            'stop', //This callback is triggered when the clock is stopped
            'reset' // This callback is triggered when the timer has been reset
          ];



        //set options from attributes
        optionKeys.forEach(function(key) {
          if(attr[key.toLowerCase()]){
            switch(key){
              case 'autostart':
                options['autoStart'] = attr[key.toLowerCase()] === 'false' ? false : true;
                break;
              case 'defaultclockface':
                options['defaultClockFace'] = attr[key.toLowerCase()];
                break;
              case 'defaultlanguage':
                options['defaultLanguage'] = attr[key.toLowerCase()];
                break;
              default:
                options[key] = attr[key.toLowerCase()];
                break;
            }
          }
        });

        //init callbacks
        callbacks.forEach(function(callback) {
          if(attr[callback]){
            options.callbacks[callback] = function(){
              $timeout(function(){
              	scope[attr[callback]](clock);
              },0);
            }
          }
        });

        //generate clock object
        //clock = new FlipClock(element, options);
        clock = element.FlipClock(options);

        //bind methods to the scope
        methods.forEach(function(method) {
          scope[method] = function(){
            return clock[method].apply(clock, arguments);
          }
        });
      }
    }
  }]);

Countdown.run(function(){
	FlipClock.LongDailyCounterFace = FlipClock.Face.extend({

		showSeconds: true,

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default
		 */

		constructor: function(factory, options) {
			this.base(factory, options);
		},

		getWeekCounter:function(showSeconds){
			var digits = [
				this.factory.time.getWeeks(),
				this.factory.time.getDays(true),
				this.factory.time.getHours(true),
				this.factory.time.getMinutes(true)
			];

			if(showSeconds) {
				digits.push(this.factory.time.getSeconds(true));
			}

			return this.factory.time.digitize(digits);
		},

		/**
		 * Build the clock face
		 */

		build: function(time) {
			var t = this;
			var children = this.factory.$el.find('ul');
			var offset = 0;

			time = time ? time : this.getWeekCounter(this.showSeconds);

			if(time.length > children.length) {
				$.each(time, function(i, digit) {
					t.createList(digit);
				});
			}

			if(this.showSeconds) {
				$(this.createDivider('Seconds')).insertBefore(this.lists[this.lists.length - 2].$el);
			}
			else
			{
				offset = 2;
			}

			$(this.createDivider('Minutes')).insertBefore(this.lists[this.lists.length - 4 + offset].$el);
			$(this.createDivider('Hours','hours')).insertBefore(this.lists[this.lists.length - 6 + offset].$el);
			$(this.createDivider('Days','days')).insertBefore(this.lists[this.lists.length - 8 + offset].$el);
			$(this.createDivider('Weeks','weeks', true)).insertBefore(this.lists[0].$el);

			this.base();
		},

		/**
		 * Flip the clock face
		 */

		flip: function(time, doNotAddPlayClass) {
			if(!time) {
				time = this.getWeekCounter(this.showSeconds);
			}

			this.autoIncrement();

			this.base(time, doNotAddPlayClass);
		}

	});
});

new scrollReveal();
