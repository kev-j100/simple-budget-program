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
		accounts: '++id,name,total,type,notes'
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
	});
}

//Refresh the table
function refreshAccountTable(){
	$(".accountTableRow").remove();
	$(".infoDiv").remove();
	$(".deleteAccountDialogDiv").remove();
	tableSetup();
}

//Adds to the table of accounts
function addToTable(name,total,id){
   //accountTable.append("<tr class='accountTableRow'>" + "<td>" + name + "</td>" + "<td>" + total + "</td>" + "<td>" + "<ul id='menu_"+ id +"'><li>&vellip;<ul><li><div id='infoButton_"+ id +"'>Info</div>" + "</li><li id='editButton_"+ id +"'>Edit</li><li><div id='delete_"+ id +"'>Delete</div></li></ul></li></ul></td>" + "</tr>");
   accountTable.append("<tr class='accountTableRow'>" + "<td>" + name + "</td>" + "<td>" + total + "</td>" + "<td>" + "<td><div id='menuButton"+ id +"' class='menuButton'>&vellip;</div><div id='infoButton_"+ id +"' class='menuItem'>Info</div><div id='editButton_"+ id +"' class='menuItem'>Edit</div><div id='delete_"+ id +"' class='menuItem'>Delete</div></td>" + "</tr>");
   $('.menuItem').button().hide();
   $('#menuButton'+id).button().click(function(){
	   $('#infoButton_'+id).toggle("slow");
	   $('#editButton_'+id).toggle("slow");
	   $('#delete_'+id).toggle("slow");
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

});
