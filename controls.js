$(function(){
	var dialog, accountForm,
	accountName = $("#accountNameEntered"),
	accountTotal = $("#accountTotalEntered"),
	accountType = $("#accountTypeEntered"),
	accountNotes = $("#accountNotesEntered"),
	allAccountFields = $([]).add(accountName).add(accountTotal).add(accountType).add(accountNotes),
	accountTable = $("#account-table");

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
   //accountTable.append("<tr class='accountTableRow'>" + "<td>" + name + "</td>" + "<td>" + total + "</td>" + "<td>" + "<ul id='menu_"+ id +"'><li>&vellip;<ul><li><div id='infoButton_"+ id +"'>Info</div>" + "</li><li id='editButton_"+ id +"'>Edit</li><li><div id='delete_"+ id +"'>Delete</div></li></ul></li></ul></td>" + "</tr>");
   accountTable.append("<tr class='accountTableRow'>" + "<td>" + name + "</td>" + "<td>" + total + "</td>" + "<td>" + "<td><div id='menuButton"+ id +"' class='menuButton'>&vellip;</div><div id='infoButton_"+ id +"' class='menuItem'>Info</div><div id='editButton_"+ id +"' class='menuItem'>Edit</div><div id='delete_"+ id +"' class='menuItem'>Delete</div><div id='Credit"+ id +"' class='menuItem'>Credit</div><div id='Debit"+ id +"' class='menuItem'>Debit</div></td></tr>");
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
	$("body").append("<div id='info_"+ id +"' class='infoDiv'>Name: "+ name +"<br>Total: "+ total +"<br>Type:" +type+ "<br>Notes: "+ notes +"</div>");
}

//Adds in Delete Dialog for each account
function makeDeleteDialog(name,id){
	$("body").append("<div id='delete_dialog_"+ id +"' class='deleteAccountDialogDiv'>Are you sure you want to delete the account, "+ name +"?</div>");
}

//Adds a dialog to update accounts
function makeUpdateDialog(name,total,type,notes,id){
	//console.log(notes);
	$("body").append("<div id='updateForm"+id+"' class='updateDialogContainDiv'><form id='update-form-form"+id+"'><fieldset><label>Name:</label><input type='text' id='accountNameEntered' name='accountNameEntered' value='"+name+"'/><label>Total:</label><input type='number' step='.01' id='accountTotalEntered' name='Total' value='"+total+"'/><label>Type:</label><input type='text' id='accountTypeEntered' name='accountTypeEntered' value='"+type+"'/><label>Notes:</label><textarea rows='4' cols='20' id='accountNotesEntered' name='accountNotesEntered' value='"+notes+"'>"+notes+"</textarea></fieldset></form></div>");
}

//Adds a dialog to the body for Credit
function makeCreditDialog(id){
	$("body").append("<div id='creditForm"+id+"' class='creditDiv'><h2>Credit</h2><form id='credit-form-form'><label>Total:</label><input id='creditTotalEntered' type='number' step='.01' value='0.00'/><label>Credit From:</label><input type='text' id='creditFromEntered'/><label>Notes:</label><textarea rows='4' cols='20' id='creditNotesEntered'/><label>Date:</label><input type='date' id='creditDateEntered'/></form></div>");
}

//Adds a dialog to the body for Debit
function makeDebitDialog(id){
	$("body").append("<div id='debitForm"+id+"' class='debitDiv'><h2>Debit</h2><form id='debit-form-form'><label>Total:</label><input id='debitTotalEntered' type='number' step='.01' value='0.00'/><label>Debit To:</label><input type='text' id='debitFromEntered'/><label>Notes:</label><textarea rows='4' cols='20' id='debitNotesEntered'/><label>Date:</label><input type='date' id='debitDateEntered'/></form></div>");
}

//Add to the account
function addAccount(){
	db.accounts.add({name:accountName.val(),total:accountTotal.val(),type:accountType.val(),notes:accountNotes.val()});
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
				console.log($("#updateForm"+id+" #accountNameEntered").val())
				db.accounts.update(id,{name: $("#updateForm"+id+" #accountNameEntered").val()});
				db.accounts.update(id,{total: $("#updateForm"+id+" #accountTotalEntered").val()});
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
            var creditTotal = $("#creditForm"+id+" #creditTotalEntered").val();
			var creditFrom = $("#creditFrom"+id+" #creditFromEntered").val();
			var creditNotes = $("#creditFrom"+id+" #creditNotesEntered").val();
			var creditDate = $("#creditFrom"+id+" #creditDateEntered").val();

				db.transaction('rw',db.accounts,db.credits,function(){
				   db.credits.add({total:creditTotal,credit_from:creditFrom,notes:creditNotes,date:creditDate,accountKey:id});
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
            var debitTotal = $("#debitForm"+id+" #debitTotalEntered").val();
			var debitTo = $("#debitFrom"+id+" #debitFromEntered").val();
			var debitNotes = $("#debitFrom"+id+" #debitNotesEntered").val();
			var debitDate = $("#debitFrom"+id+" #debitDateEntered").val();

				db.transaction('rw',db.accounts,db.credits,function(){
				   db.debits.add({total:debitTotal,debit_to:debitTo,notes:debitNotes,date:debitDate,accountKey:id});
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
		console.log("clicked");
		$("#debitForm"+id).dialog("open");
	});
}
});
