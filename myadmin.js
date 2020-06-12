(function(){

	var Dashboard = window.Dashboard = {

		options: {
			page:null,
			portals:null,
			dashboard: null,
			traductions: null,
			filters: null,
			dataPanel: null,
	        monthPanel: null,
	        inputPanel: null,
	        inputsDisplay: null,
	        recordsDisplay: null,
	        csrftoken: null,
		},

		init: function(param,csrftoken,page) {
			this.options.csrftoken = csrftoken;
			this.setOptions(param);
			this.refreshDashboard();
		},

		setOptions: function(param) {
			for( elmt in param ){
				this.options[elmt] = param[elmt];
			}
			this.options.inputPanel = $('#addcategory');
			this.options.recordsDisplay = $('#recordsDisplay');
			//console.log(this.options);
		},

		refreshDashboard: function() {
		
			this.options.inputPanel.empty();
			this.options.inputPanel.append( this.options.csrftoken );

			this.buildInputPanel();

		},

		buildInputPanel: function() {
			var zone = this.options.inputPanel;
			var data = this.options.dashboard;

			// Portals
			var data_portal = this.options.dashboard["portals"];
			// Form
			var form_group = $('<div class="form-group"></div>');
			var select_group = $('<select class="user_filter form-control"></select>');
				select_group.attr({
								"id":this.capitalize( this.options.traductions["portals"] ),
								"placeholder":this.capitalize( this.options.traductions["portals"] ),
								"name":"portal" });
				form_group.append(select_group);
				zone.append(form_group);
			// Select list
			var o = new Option( "", "" );
				$(o).attr({selected:"selected",disabled:"disabled"}); //,disabled:"disabled"
				$(o).html( this.capitalize( this.options.traductions["portals"] ) );
				select_group.append(o);

			for( var elmt in data_portal ){
				//console.log(elmt);
				if( elmt != "portals" ){
					var o = new Option( data_portal[elmt], data_portal[elmt] );
					$(o).html( this.capitalize( data_portal[elmt] ) );
					select_group.append(o); //toString(choice)
				}
			}

			// Categories
			// Form
			var form_group = $('<div class="form-group"></div>');
			var select_group = $('<select class="user_filter form-control"></select>');
				select_group.attr({
								"id":this.capitalize( this.options.traductions["categories"] ),
								"placeholder":this.capitalize( this.options.traductions["categories"] ),
								"name":"category" });
				form_group.append(select_group);
				zone.append(form_group);
			// Select list
			for( var elmt in data ){
				//console.log(elmt);
				if( elmt != "portals" ){
					var o = new Option( elmt, elmt );
					$(o).html( this.capitalize( this.options.traductions[elmt] ) );
					select_group.append(o); //toString(choice)
				}
			}

			var o = new Option( "", "" );
				$(o).attr({selected:"selected",disabled:"disabled"}); //,disabled:"disabled"
				$(o).html( this.capitalize( this.options.traductions["categories"] ) );
				select_group.prepend(o);

			// Common
			var data_common = ["Non","Oui"];
			// Form
			var form_group = $('<div class="form-group" id="form_exception"></div>');
				form_group.hide();
			var select_group = $('<select class="user_filter form-control"></select>');
				select_group.attr({
								"id":this.capitalize( this.options.traductions["exception"] ),
								"placeholder":this.capitalize( this.options.traductions["exception"] ),
								"name":"exception" });
				form_group.append(select_group);
				zone.append(form_group);
			// Select list
			for( var elmt in data_common ){
				//console.log(elmt);
				var o = new Option( elmt, elmt );
				$(o).html( this.capitalize( data_common[elmt] ) );
				select_group.append(o);
			}

			var o = new Option( "", "" );
				$(o).attr({selected:"selected",disabled:"disabled"}); //,disabled:"disabled"
				$(o).html( this.capitalize( this.options.traductions["exception"] ) );
				select_group.prepend(o);

			// Input
			// Form
			var form_group = $('<div class="form-group"></div>');
			var select_group = $('<input type="text" class="form-control" style="width:100%;"></input>');
				select_group.attr({"id":"name","name":"name","placeholder":this.capitalize( this.options.traductions["name"] )});
				form_group.append(select_group);
				zone.append(form_group);
			// Button
			var button = '<button id="add" type="submit" class="btn btn-info">'+this.capitalize( this.options.traductions["add"] )+'</button>';
			zone.append(button);

			$(".user_filter").change(function(){
		        Dashboard.manageFilters(this);
		    });

		},

		manageFilters: function(obj) {
			var recordsDisplay = this.options.recordsDisplay;
				recordsDisplay.empty();
	        var id = $(obj).children("option:selected").val();
	        console.log( id );
        	var list = $('<ul id="existing_records">');
        	//console.log( this.options.dashboard[id] );
        	for( elmt in this.options.dashboard[id] ){
        		// console.log( this.options.dashboard[id][elmt] );
        		var item = $('<li>').html( this.capitalize( this.options.dashboard[id][elmt] ) );
				list.append(item);
        	}
        	recordsDisplay.append( list );     	    
        	this.sortList();

        	if( id == "motivation" ){ $("#form_exception").show(); }else{ $("#form_exception").hide(); }
		},

		sortList: function() {
		var list, i, switching, b, shouldSwitch;
		list = document.getElementById("existing_records");
		switching = true;

		while (switching) {
			switching = false;
		    b = list.getElementsByTagName("LI");
		    for (i = 0; i < (b.length - 1); i++) {
		      	shouldSwitch = false;
		     	if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
		        	shouldSwitch = true;
		        	break;
		      	}
		    }
			    if (shouldSwitch) {
			    	b[i].parentNode.insertBefore(b[i + 1], b[i]);
			    	switching = true;
			    }
		  	}
		},

		capitalize: function(word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		},

		dateParser: function(date,input=false) {
			var date_to_parse = new Date(date);
			if( input ){
				if( date_to_parse.getMonth()+1 < 10 ){
					date_to_parse = date_to_parse.getFullYear()+'-0'+(date_to_parse.getMonth()+1)+'-'+date_to_parse.getDate();
				}else{
					date_to_parse = date_to_parse.getFullYear()+'-'+(date_to_parse.getMonth()+1)+'-'+date_to_parse.getDate();
				}
			}else{
				date_to_parse = date_to_parse.getDate()+'/'+( date_to_parse.getMonth() + 1)+'/'+date_to_parse.getFullYear();
			}
			return date_to_parse;
		},

	}

})();