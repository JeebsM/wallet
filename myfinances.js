(function(){

	var Wallet = window.Wallet = {

		options: {},

		data: {},

		tools: {},

		init: function(dashboard,options,data) {

			//console.log( options );
			this.options = options;
			this.data = data;
			this.tools = dashboard;
			//this.refreshDashboard();
			return true;

		},

		refreshDashboard: function(obj=null) {
			//console.log(obj); console.log(this.options);
			//this.options.filters = this.tools.setFilters(obj, this.options.filters);
			this.options.filters["exception"] = 0;
				
			switch( this.options.page ){
				case "add":

					this.options.inputPanel.show( 500 );
					for( elmt in this.options.inputsDisplay ){ this.options.inputsDisplay[elmt].show(); }

					break;
				case "synthesis":

					this.options.inputPanel.hide( 500 );

					this.options.filters = this.tools.setFilters(obj, this.options.filters);
					this.options.filters["exception"] = null;

					var temp_data = this.tools.setReport( this.options.filters, this.data );
					var data_list = this.writeListData( temp_data );
					var data_synthesis = this.tools.setSynthesis( this.options.filters, temp_data );

					this.tools.refreshDataPanel( this.options.dataPanel, data_list );						
					this.writeStatReport( data_synthesis );
					break;
				default:

					this.options.inputPanel.show( 500 );
					for( elmt in this.options.inputsDisplay ){ this.options.inputsDisplay[elmt].hide(); }

					this.options.filters = this.tools.setFilters(obj, this.options.filters);

					var temp_data = this.tools.setReport( this.options.filters, this.data );
					var data_list = this.writeListData( temp_data );
					var data_synthesis = this.tools.setSynthesis( this.options.filters, temp_data );

					this.tools.refreshDataPanel( this.options.dataPanel, data_list );
					this.writeStdReport( data_synthesis );
			}

		},

		writeStdReport: function( data ) {
			//console.log(data);
			this.options.dataReport.empty();
			var denominator = new Date().getMonth() + 1;

			var list = $('<ul>');
			for( var elmt in data["r_motivation"] ){
				//var mean = data["cat_expenses"][elmt] / denominator;
				var content = "<strong>"+this.tools.capitalize( this.options.dashboard["motivation"][elmt] )+"</strong> = "+data["r_motivation"][elmt].toFixed(2)+" €.";
				var item = $("<li>").html(content);
				list.append( item );
			}

			var mean = data["r_year"] / denominator;

			this.options.dataReport.prepend(list);
			this.options.dataReport.prepend("<h3 class='text-center'>"+data["r_month"].toFixed(2)+" € dépensés durant cette période.</h3>");
			this.options.dataReport.prepend("<h6 class='text-center'>"+data["r_year"].toFixed(2)+" € dépensés cette année ("+mean.toFixed(2)+" €/mois).</h6>");
		},

		writeStatReport: function( data ) {
			//console.log(data);
			this.options.dataReport.empty();
			var denominator = $("div[data-open='true']").length;
			var sum_expense = 0;

			if( denominator < 1 ){ denominator = 1; }

			var table = $('<table class="table table-striped">');
			var title_row = $('<thead>'); 
			var tbody = $('<tbody>');

			table.append(	'<tr><th>'+this.tools.capitalize( this.options.traductions["motivation"] )+
						 	'</th><th>'+this.tools.capitalize( this.options.traductions["amount"] )+
							'</th><th>'+this.tools.capitalize( this.options.traductions["mean"] )+
							'</th><th>'+this.tools.capitalize( this.options.traductions["add"] )+'</th></tr>');			

			for( var elmt in data["r_motivation"] ){

				var mean = data["r_motivation"][elmt] / denominator;
				sum_expense = sum_expense + Math.ceil( mean );

				var category = "<td><strong>"+this.tools.capitalize( this.options.dashboard["motivation"][elmt] )+"</strong></td>";
				var total = "<td>"+data["r_motivation"][elmt].toFixed(2)+" €</td>";
				var mitigation = "<td>"+mean.toFixed(2)+" €</td>";
				var choice = "<td><input type='checkbox' checked class='summary_expense' id='"+elmt+"' name='"+elmt+"' value='"+Math.ceil(mean)+"' use_it='true'></td>";

				var item = $('<tr>').append(category,total,mitigation,choice);
				tbody.append( item );
			}

			//var mean = data["r_year"] / denominator;
			table.append(tbody);
			this.options.dataReport.prepend(table);
			this.options.dataReport.prepend("<h6 class='text-center'><span id='summary_expense_div'>"+Math.ceil(sum_expense/2)+"</span> €/pers.</h6>");
			this.options.dataReport.prepend("<h3 class='text-center'><span id='summary_expense'>"+Math.ceil(sum_expense)+"</span> € à pourvoir.</h3>");

			$('.summary_expense').on('click', function(){
				var old = parseInt( $("#summary_expense").text() );
			    var minus = parseInt( $(this).val() );
			    var new_sum = 0;
			    //console.log(old); console.log(minus); console.log( $(this).attr('use_it') );
				if( $(this).attr('use_it') == "true" ){
					$(this).attr({"use_it":'false'});
					new_sum = old - minus;
				}else{
					$(this).attr({"use_it":'true'});
					new_sum = old + minus;
				}
				$("#summary_expense").html( Math.ceil(new_sum) );
				$("#summary_expense_div").html( Math.ceil(new_sum/2) );
			});
		},

		writeListData: function(data) {

			var result = [];

			for( var elmt in data ) {
				//console.log( new Date( data[elmt]["period"] ).getMonth() );
				//var date = this.tools.dateParser( data[elmt]["period"] );
				//var month = this.options.traductions["months"][ new Date( data[elmt]["period"] ).getMonth() ];
				var month = new Date( data[elmt]["period"] ).getMonth();
				var amount = data[elmt]["amount"];
				var destination = this.tools.capitalize( this.options.dashboard["destination"][ data[elmt]["destination"] ] );
				var source = this.tools.capitalize( this.options.dashboard["source"][ data[elmt]["source"] ] );
				var motivation = this.tools.capitalize( this.options.dashboard["motivation"][ data[elmt]["motivation"] ] ); 

				var html = 	"<div class='column col-4 font-weight-bold'>"+motivation+": </div>"+
							"<div class='column col-3 text-center'>"+source+"</br>"+amount+" €</div>"+
							"<div class='column col-3 text-right'>"+destination+"</div>";

				result.push( { "period":month, "html":html } );
			}
		
			return result;

		},

	}

})();

