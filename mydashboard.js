(function(){

	var Dashboard = window.Dashboard = {

		options: {
			page:"home",
			portals:null,
			portal: null,
			dashboard: null,
			traductions: null,
			filters: null,
			dataPanel: null,
	        monthPanel: null,
	        inputPanel: null,
	        dataReport: null,
	        inputsDisplay: [],
		},

		init: function(dashboard,param,page,portal) {

			this.options.page = page;
			this.options.portal = portal;
			this.setOptions(param,dashboard);
			// console.log(this.options);
			this.buildMonthPanel( dashboard );
			this.buildInputPanel( dashboard );

			return this.options;

		},

		setOptions: function(param,dashboard) {
			//console.log(param["dashboard"]);
			for( elmt in param ){
				//this.options[elmt] = dashboard.sortAssocObject( param[elmt] );
				this.options[elmt] = param[elmt];
			}

			this.options.dataPanel = $('#dataLines');
			this.options.monthPanel = $('#dataMonth');
			this.options.inputPanel = $('#inputPanel');
			this.options.dataReport = $('#dataReport');

		},

		buildMonthPanel: function(dashboard) {

			var zoneMonth = this.options.monthPanel;
				zoneMonth.empty();
			var zoneData = this.options.dataPanel;
				zoneData.empty();

			for( var month in this.options.traductions["months"] ){

				var month_container = $('<div></div>');
					month_container
						.attr( {"id":"month"+month, "month":month, "class":"d-inline-block badge_month", "data-open":"false"} )
						.css( {"margin-right":"1em", "vertical-align":"top"} )
						.html( "<h6 class='text-uppercase'>"+this.options.traductions["months"][month]+"<span class='badge'></span></h6>" );
					zoneMonth.append( month_container );

				var divider = $('<div><h5>'+this.options.traductions["months"][month].toUpperCase()+'</h5></div>');
					divider
						.attr( {"class":"border-top my-3 text-center"} );
						//.hide();

				var month_data_container = $('<div></div>');
					month_data_container
						.attr( {"id":"_month"+month,"class":"month_container"} );
					month_data_container.append(divider);

				zoneData.append( month_data_container );
				month_data_container.hide();

			}

		},

		buildInputPanel: function(dashboard) {

			var zone = this.options.inputPanel;
			var data = this.options.dashboard;
			var today_date = dashboard.dateParser( new Date(), true );
			//console.log(data);
			for( var elmt in data ){

				// Form
				var form_group = $('<div class="form-group"></div>');
				var select_group = $('<select class="user_filter form-control"></select>');
					select_group.attr({"id":elmt,"placeholder":elmt,"name":elmt});
					form_group.append(select_group);
					zone.append(form_group);

				// Select list
				for( var choice in data[elmt] ){

					var o = new Option( data[elmt][choice], choice );
					//console.log(data[elmt]);
					if( this.options.filters[elmt] == choice ){
						$(o).attr({selected:"selected"});
					}

					$(o).html( dashboard.capitalize( data[elmt][choice] ) );
					$("#"+elmt ).append(o);

				}

				$("#"+elmt).html( $("#"+elmt+" option").sort(
					function (a, b) {
				    	return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
					} )
				);

				var o = new Option( "", "" );
					$(o).attr({selected:"selected"}); //,disabled:"disabled"
					$(o).html( dashboard.capitalize( this.options.traductions[elmt] ) );
					$("#"+elmt).prepend(o);

			}

			// Form
			var form_group = $('<div class="form-group"></div>');
				form_group.hide();
			var select_group = $('<input type="text" class="form-control" style="width:100%;"></input>');
				select_group.attr({"id":"portal","name":"portal","value":this.options.portal});
				form_group.append(select_group);
				zone.prepend(form_group);

			// Form
			var form_group = $('<div class="form-group portal-form-add"></div>');
			var select_group = $('<input type="date" class="form-control" style="width:100%;"></input>');
				select_group.attr({"id":"period","name":"period","value":today_date});
				form_group.append(select_group);
				zone.prepend(form_group);

			// Form
			var form_group = $('<div class="form-group portal-form-add"></div>');
			var select_group = $('<input type="number" class="form-control input-lg" step=".01" min="0" style="width:100%;"></input>');
				select_group.attr({"id":"amount","name":"amount","placeholder":dashboard.capitalize( this.options.traductions["amount"] )});
				form_group.append(select_group);
				zone.prepend(form_group);				

			// Button
			var button = $('<button id="add" type="submit" class="btn btn-info portal-form-add">');
				button.html( dashboard.capitalize( this.options.traductions["add"] ) );
				zone.append(button);

			$(".portal-form-add").each(function(){
				Dashboard.options.inputsDisplay.push( $(this) );
			});

		},

		createListeners: function(){
			$('#refresh').on('click', function(){
				$(".user_filter").each(function(){
					$(this).val("");
				});
				$(".badge_month").each(function(){
			        var id = "#_month"+$(this).attr("month");
			        if( $(this).attr('data-open') == "true" ){
			            $(this).attr({"data-open":"false"});
			            $(this).children("h6").removeClass("font-weight-bold");
			            $(id).toggle(500);
		        	}
				});
			    Wallet.options.page = "home";
			    Wallet.refreshDashboard();
			});
			$('#addRecord').on('click', function(){
			    Wallet.options.page = "add";
			    Wallet.refreshDashboard();
			});
			$('#showSynthesis').on('click', function(){
			    Wallet.options.page = "synthesis";
			    Wallet.refreshDashboard();
			});
			$(".user_filter").change(function(){
			    Wallet.refreshDashboard(this);
			});
			$(".badge_month").on('click', function(){

		        var id = "#_month"+$(this).attr("month");

		        if( $(this).attr('data-open') == "true" ){
		            $(this).attr({"data-open":"false"})
		            $(this).children("h6").removeClass("font-weight-bold");
		        }else{
		            $(this).attr({"data-open":"true"})
		            $(this).children("h6").addClass("font-weight-bold");
		        }
		        //console.log( id );
		        $(id).toggle(500);
		        //console.log("test");
		        Wallet.refreshDashboard();

			});

		},

	}

})();