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
	db.accounts.each(function (accounts){
	addToTable(accounts.name,accounts.total);
	});


//Adds to the table of accounts
function addToTable(name,total){
   accountTable.append("<tr>" + "<td>" + name + "</td>" + "<td>" + total + "</td>" + "</tr>");
}

//Add to the account
function addAccount(){
	db.accounts.add({name:accountName.val(),total:accountTotal.val(),type:accountType.val(),notes:accountNotes.val()});
	addToTable(accountName.val(),accountTotal.val());
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

	accountForm	= dialog.find("form").on("submit",function(event){
		event.preventDefault();
		addAccount();
	});

	$("#top-controls").button().on("click",function(){
		dialog.dialog("open");
	});
});
