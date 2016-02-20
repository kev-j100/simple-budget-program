$(function(){
	var dialog, accountForm,
	allAccountsTotal = 0,
	accountName = $("#accountNameEntered"),
	accountTotalDollars = $("#accountTotalDollarsEntered"),
	accountTotalCents = $("#accountTotalCentsEntered"),
	accountType = $("#accountTypeEntered"),
	accountNotes = $("#accountNotesEntered"),
	allAccountFields = $([]).add(accountName).add(accountTotalDollars).add(accountTotalCents).add(accountType).add(accountNotes),
	accountTable = $("#account-table"),
	currencyStmbol = "$";

	var db = new Dexie("budget-database");

	db.version(1).stores({
		accounts: '++id,name,total,type,notes',
		credits: '++id,total,credit_from,notes,date,accountKey',
		debits: '++id,total,debit_to,notes,date,accountKey'
	});
//Open the database
	db.open();

//Initial population of the accounts table
tableSetup();


//Adds all account items to table
function tableSetup(){
	db.accounts.each(function (accounts){

	addToTable(accounts.name,accounts.total,accounts.id);
	addInfoToBody(accounts.name,accounts.total,accounts.type,accounts.notes,accounts.id);
	makeInfoDialog(accounts.id);
	//makeMenues(accounts.id);
	makeDeleteDialog(accounts.name,accounts.id);
	deleteAccount(accounts.id);
	makeUpdateDialog(accounts.name,accounts.total,accounts.type,accounts.notes,accounts.id);
    updateAccount(accounts.id);
	makeCreditDialog(accounts.id);
    creditAccount(accounts.id);
	makeDebitDialog(accounts.id);
	debitAccount(accounts.id);
	});
}

function updateAccountsTotal(total){
	allAccountsTotal = allAcountsTotal + total;
}

//Refresh the table
function refreshAccountTable(){
	$(".accountTableRow").remove();
	$(".infoDiv").remove();
	$(".deleteAccountDialogDiv").remove();
	$(".updateDialogContainDiv").remove();
	$(".creditDiv").remove();
	$(".debitDiv").remove();
	tableSetup();
}

//Adds to the table of accounts
function addToTable(name,total,id){

	var moneyDisplay = total.toString().slice(0,-2) + "." + total.toString().slice(-2);

    accountTable.append("<tr class='accountTableRow'>" + "<td>" + name + "</td>" + "<td>"+ currencyStmbol + moneyDisplay + "</td>" + "<td>" + "<td><div id='menuButton"+ id +"' class='menuButton'>&vellip;</div><div id='infoButton_"+ id +"' class='menuItem'>Info</div><div id='editButton_"+ id +"' class='menuItem'>Edit</div><div id='delete_"+ id +"' class='menuItem'>Delete</div><div id='Credit"+ id +"' class='menuItem'>Credit</div><div id='Debit"+ id +"' class='menuItem'>Debit</div></td></tr>");
   $('.menuItem').button().hide();
   $('#menuButton'+id).button().click(function(){
	   $('#infoButton_'+id).toggle("slow");
	   $('#editButton_'+id).toggle("slow");
	   $('#delete_'+id).toggle("slow");
	   $('#Credit'+id).toggle("slow");
	   $('#Debit'+id).toggle("slow");
   });
}

//Add div to the body for info dialog
function addInfoToBody(name,total,type,notes,id){

	var moneyDisplay = total.toString().slice(0,-2) + "." + total.toString().slice(-2);

	$("body").append("<div id='info_"+ id +"' class='infoDiv'>Name: "+ name +"<br>Total: "+ currencyStmbol + moneyDisplay +"<br>Type: "+ type + "<br>Notes: "+ notes +"</div>");
}

//Adds in Delete Dialog for each account
function makeDeleteDialog(name,id){
	$("body").append("<div id='delete_dialog_"+ id +"' class='deleteAccountDialogDiv'>Are you sure you want to delete the account, "+ name +"?</div>");
}

//Adds a dialog to update accounts
function makeUpdateDialog(name,total,type,notes,id){

	var moneyDisplay1 = total.toString().slice(0,-2);
 	var moneyDisplay2 = total.toString().slice(-2);

	$("body").append("<div id='updateForm"+id+"' class='updateDialogContainDiv'><form id='update-form-form"+id+"'><fieldset><label>Name:</label><input type='text' id='accountNameEntered' name='accountNameEntered' value='"+name+"'/><label>Total:</label>"+currencyStmbol+"<input type='number' step='1' id='accountTotalDollarsEntered' name='Total' value='"+moneyDisplay1+"' min='0'/>.<input type='number' step='1' id='accountTotalCentsEntered' name='Total' value='"+moneyDisplay2+"' min='0' max='99'/><label>Type:</label><input type='text' id='accountTypeEntered' name='accountTypeEntered' value='"+type+"'/><label>Notes:</label><textarea rows='4' cols='20' id='accountNotesEntered' name='accountNotesEntered' value='"+notes+"'>"+notes+"</textarea></fieldset></form></div>");
}

//Adds a dialog to the body for Credit
function makeCreditDialog(id){
	$("body").append("<div id='creditForm"+id+"' class='creditDiv'><h2>Credit</h2><form id='credit-form-form'><label>Total:</label>"+currencyStmbol+"<input id='creditTotalDollarsEntered' type='number' step='1' value='0' min='0'/>.<input id='creditTotalCentsEntered' type='number' step='1' value='0' min='0' max='99'/><label>Credit From:</label><input type='text' id='creditFromEntered'/><label>Notes:</label><textarea rows='4' cols='20' id='creditNotesEntered'/><label>Date:</label><input type='date' id='creditDateEntered'/></form></div>");
}

//Adds a dialog to the body for Debit
function makeDebitDialog(id){
	$("body").append("<div id='debitForm"+id+"' class='debitDiv'><h2>Debit</h2><form id='debit-form-form'><label>Total:</label>"+currencyStmbol+"<input id='debitTotalDollarsEntered' type='number' step='1' value='0' min='0'/>.<input id='debitTotalCentsEntered' type='number' step='1' value='0' min='0' max='99'/><label>Debit To:</label><input type='text' id='debitFromEntered'/><label>Notes:</label><textarea rows='4' cols='20' id='debitNotesEntered'/><label>Date:</label><input type='date' id='debitDateEntered'/></form></div>");
}

//Add to the account
function addAccount(){
	var accountTotal = "0"
	var dollars = accountTotalDollars.val();
	var cents = accountTotalCents.val();

	if (cents.length == 1){
		var revAccountTotalCents = "0" + cents;
		accountTotal = dollars.toString() + revAccountTotalCents.toString();
	}
	else{
		accountTotal = dollars.toString() + cents.toString();
	}

	db.accounts.add({name:accountName.val(),total:accountTotal,type:accountType.val(),notes:accountNotes.val()});
	refreshAccountTable();
	dialog.dialog("close");
	return true;
}

//Dialog for account
	dialog = $("#new-account-form").dialog({
		autoOpen:false,
		height: 300,
		width:350,
		modal: true,
		buttons: {
			"New Account": addAccount,
		Cancel: function(){
			dialog.dialog("close");
		}
	},
		close:function(){
			accountForm[0].reset();
			allAccountFields.removeClass("ui-state-error");
		}
	});

//Form for account
	accountForm	= dialog.find("#new-account-form-form").on("submit",function(event){
		event.preventDefault();
		addAccount();
	});

//Makes the info dialog
function makeInfoDialog(id){

	$("#info_"+id).dialog({
		autoOpen:false
	});

	$("#infoButton_"+id).click(function(){
		$("#info_"+id).dialog("open");
	});
}

	$("#top-controls").button().on("click",function(){
		dialog.dialog("open");
	});

//Menu ui for account rows
function makeMenues(id){
$( "#menu_"+ id ).menu();
}

//Delete account
function deleteAccount(id){
	$("#delete_dialog_"+id).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Delete": function(){
				$(this).dialog("close");
				db.accounts.delete(id);
				refreshAccountTable();
			},
			Cancel: function(){
				$(this).dialog("close");
			}
		}
	});

	$("#delete_"+id).on("click",function(){
		$("#delete_dialog_"+id).dialog("open");
	});
}

//Update Account functions
function updateAccount(id){
	$("#updateForm"+id).dialog({
		autoOpen:false,
		height: 300,
		width:350,
		modal: true,
		buttons: {
			"Update Account": function(){
				$(this).dialog("close");

					var accountTotal = "0"
	                var dollars = $("#updateForm"+id+" #accountTotalDollarsEntered").val();
	                var cents = $("#updateForm"+id+" #accountTotalCentsEntered").val();

	                if (cents.length == 1){
		                   var revAccountTotalCents = "0" + cents;
		                   accountTotal = dollars.toString() + revAccountTotalCents.toString();
	                    }
	                else{
		                   accountTotal = dollars.toString() + cents.toString();
	                    }

				db.accounts.update(id,{name: $("#updateForm"+id+" #accountNameEntered").val()});
				db.accounts.update(id,{total: accountTotal});
				db.accounts.update(id,{type: $("#updateForm"+id+" #accountTypeEntered").val()});
				db.accounts.update(id,{notes: $("#updateForm"+id+" #accountNotesEntered").val()});
			    refreshAccountTable();
			},
		Cancel: function(){
			$("#updateForm"+id).dialog("close");
		}
	},
		close:function(){
			accountForm[0].reset();
			allAccountFields.removeClass("ui-state-error");
		}
	});

	$("#editButton_"+id).on("click",function(){
		$("#updateForm"+id).dialog("open");
	});
}

//Credit form fuction
function creditAccount(id){
	$("#creditForm"+id).dialog({
		autoOpen:false,
		height: 300,
		width:350,
		modal: true,
		buttons: {
			"Add Credit": function(){
				$(this).dialog("close");

            var dollars = $("#creditForm"+id+" #creditTotalDollarsEntered").val();
			var cents = $("#creditForm"+id+" #creditTotalCentsEntered").val();
			var creditFrom = $("#creditFrom"+id+" #creditFromEntered").val();
			var creditNotes = $("#creditFrom"+id+" #creditNotesEntered").val();
			var creditDate = $("#creditFrom"+id+" #creditDateEntered").val();

				var creditTotal = "0"

	            if (cents.length == 1){
		                var revAccountTotalCents = "0" + cents;
		                creditTotal = dollars.toString() + revAccountTotalCents.toString();
	                }
	            else{
		                creditTotal = dollars.toString() + cents.toString();
	                }

			    db.credits.add({total:creditTotal,credit_from:creditFrom,notes:creditNotes,date:creditDate,accountKey:id});

				db.transaction('rw',db.accounts,function(){
				db.accounts.get(id).then(function(account){

		          var newTotal = parseInt(creditTotal) + parseInt(account.total);

				  db.accounts.update(id,{total: newTotal.toString()});

	         });

				}).catch(function(error){
					alert("Ooops: " + error);
				});

			    refreshAccountTable();
			},
		Cancel: function(){
			$("#creditForm"+id).dialog("close");
		}
	},
		close:function(){
			accountForm[0].reset();
			allAccountFields.removeClass("ui-state-error");
		}
	});

	$("#Credit"+id).on("click",function(){
		$("#creditForm"+id).dialog("open");
	});
}

//Debit form function
function debitAccount(id){
	$("#debitForm"+id).dialog({
		autoOpen:false,
		height: 300,
		width:350,
		modal: true,
		buttons: {
			"Add Debit": function(){
				$(this).dialog("close");
             var dollars = $("#debitForm"+id+" #debitTotalDollarsEntered").val();
			var cents = $("#debitForm"+id+" #debitTotalCentsEntered").val();
			var debitFrom = $("#debitFrom"+id+" #creditFromEntered").val();
			var debitNotes = $("#debitFrom"+id+" #creditNotesEntered").val();
			var debitDate = $("#debitFrom"+id+" #creditDateEntered").val();

				var debitTotal = "0"

	            if (cents.length == 1){
		                var revAccountTotalCents = "0" + cents;
		                debitTotal = dollars.toString() + revAccountTotalCents.toString();
	                }
	            else{
		                debitTotal = dollars.toString() + cents.toString();
	                }

			    db.debits.add({total:debitTotal,credit_from:debitFrom,notes:debitNotes,date:debitDate,accountKey:id});

				db.transaction('rw',db.accounts,function(){
				db.accounts.get(id).then(function(account){

		          var newTotal =  parseInt(account.total) - parseInt(debitTotal);

				  db.accounts.update(id,{total: newTotal.toString()});

	         });

				}).catch(function(error){
					alert("Ooops: " + error);
				});

			    refreshAccountTable();
			},
		Cancel: function(){
			$("#debitForm"+id).dialog("close");
		}
	},
		close:function(){
			accountForm[0].reset();
			allAccountFields.removeClass("ui-state-error");
		}
	});

	$("#Debit"+id).on("click",function(){
		$("#debitForm"+id).dialog("open");
	});
}

 $( ".spinner").spinner({
      min: 5,
      max: 2500,
      step: .01,
      start: 1000,
      numberFormat: "c",
	  culture: "en-US"
    });

});
