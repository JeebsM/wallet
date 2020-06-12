function myPortal() 
{

	myPortal.prototype.refreshDataPanel = function( zone, data ) {
		
		$(".data_month").remove();
		
		for( var elmt in data ){
			//console.log( data[elmt] );
			var div_month = $("#_month"+data[elmt]["period"]);

			var data_container = $('<div></div>');
				data_container
					.attr( {"id":elmt, "class":"data_month"} );
					//.hide();

			var data_elmt = $('<div></div>')
					.attr({"class":"row"})
					.html( data[elmt]["html"] );
				data_container.append(data_elmt);

			div_month.append(data_container);

		}

		$(".badge_month").each(function(){

		    var count_of_elmts = $("#_month"+$(this).attr("month")+" > div[class='data_month']").length;
		    //console.log(this); console.log(count_of_elmts); console.log( $(this).children("badge") );
		    if( count_of_elmts > 0 ){
		    	$(this).children("h6").children("span").html(count_of_elmts.toString());
		    }else{
		    	$(this).children("h6").children("span").html("");
		    }
		    

		});

		//$(".month_container").hide();
		
	}

	myPortal.prototype.setReport = function(filters, data){

		var filtered_data = {};
		// console.log(filters); console.log(data);
		for( var elmt in data ){

			var add_elmt = true;

			for( var filter in filters ){

				if( filters[filter] != null && data[elmt][filter] != filters[filter] && filter != "period" ){
					add_elmt = false;
				}

			}

			if( add_elmt === true ){
				filtered_data[elmt] = data[elmt];
			}

		}

		for( var elmt in filtered_data ){
			filtered_data[elmt]["date"] = new Date( filtered_data[elmt]["period"] );
		}

		return filtered_data;
	}

	myPortal.prototype.setSynthesis = function(filters, data){

		var result = {
			"r_year": 0,
			"r_month": 0,
			"r_motivation": {},
			"r_destination": {},
		}			
		
		for( var elmt in data ){

			var amount = parseFloat( data[elmt]["amount"] );
			var motivation = data[elmt]["motivation"];
			var destination = data[elmt]["destination"];

			result["r_year"] = result["r_year"] + amount;
			
			if( filters["period"].includes( data[elmt]["date"].getMonth().toString() ) ){

				result["r_month"] = result["r_month"] + amount;

				if( result["r_motivation"][ motivation ] ){
					result["r_motivation"][ motivation ] = result["r_motivation"][ motivation ] + amount;
				}else{
					result["r_motivation"][ motivation ] = amount;
				}

				if( result["r_destination"][ destination ] ){
					result["r_destination"][ destination ] = result["r_destination"][ destination ] + amount;
				}else{
					result["r_destination"][ destination ] = amount;
				}

			}				
		}
		//console.log( result );
		return result;	
	}

	myPortal.prototype.setFilters = function(obj,filters) {

		if( obj ){
			var cle = $(obj).attr("id");
			var value = $(obj).children("option:selected").val();
			if( value == "" ){
	        	filters[cle] = null; 
	        }else{
	        	filters[cle] = value; 
	        }
		}			

		filters["period"] = [];

        $('div[data-open="true"]').each(function() {
        	var month = $(this).attr("month");
		    filters["period"].push( month );
		});			

		if( filters["period"] == null || filters["period"].length <= 0 ){ 
			filters["period"] = [ new Date().getMonth().toString() ]; 
		}
        //console.log(this.options.filters);
        return filters;
	}

	myPortal.prototype.capitalize = function( word ) {

		return word.charAt(0).toUpperCase() + word.slice(1);

	}

	myPortal.prototype.dateParser = function(date,input=false) {

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

	}

	myPortal.prototype.sortAssocObject = function(list) {
		
	    var sortable = [];
	    for (var key in list) {
	        sortable.push([key, list[key]]);
	        //sortable.push([ key.toString(), list[key].toString() ]);
	    }
	    // [["you",100],["me",75],["foo",116],["bar",15]]

	    sortable.sort(function(a, b) {
	        return (a[1] < b[1] ? -1 : (a[1] > b[1] ? 1 : 0));
	    });
	    // [["bar",15],["me",75],["you",100],["foo",116]]

	    var orderedList = {};
	    for (var idx in sortable) {
	        orderedList[sortable[idx][0]] = sortable[idx][1];
	    }
		
	    return orderedList;
	}

}