var accountForm = document.getElementById("new-account-form");
var newAccount = document.getElementById("top-controls");
var accountCancel = document.getElementById("accountCancel");
var accountOk = document.getElementById("accountOk");
var accountTable = document.getElementById("account-table");

accountForm.style.display = "none";

//Defines database
var db = new Dexie("budget-database");

db.version(1).stores({
	accounts: '++id,name,total,type,notes'
});

//Open the database
db.open();

db.accounts.each(function (accounts){
console.log(accounts.name);
console.log(accounts.total);
console.log(accounts.id);
addToTable(accounts.name,accounts.total);
});

//console.log("I am running")

//Shows the new account form
function addAccount(){
	accountForm.style.display = "";
	}

//Click the new account button to show
newAccount.onclick = function(){
addAccount();
	};

accountOk.onclick = function () {
	db.accounts.add({name:document.getElementById("accountNameEntered").value,total:document.getElementById("accountTotalEntered").value,type:document.getElementById("accountTypeEntered").value,notes:document.getElementById("accountNotesEntered").value});
	addToTable(document.getElementById("accountNameEntered").value,document.getElementById("accountTotalEntered").value)
};

//Adds to the table of accounts
function addToTable(accountName,accountTotal){
	//console.log(accountName);
	//console.log(accountTotal);
	var row = accountTable.insertRow();
	var cell1 = row.insertCell();
	var cell2 = row.insertCell();
	cell1.innerHTML = accountName
	cell2.innerHTML = accountTotal
}

//Cancels the new account form
function hideAccountForm(){
	accountForm.style.display = "none";
	document.getElementById("accountNameEntered").value = ""
	document.getElementById("accountTotalEntered").value = ""
	document.getElementById("accountTypeEntered").value = ""
	document.getElementById("accuntNotesEntered").value = ""
}
accountCancel.onclick = function(){
hideAccountForm();
}
