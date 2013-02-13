Osp.Core.Mixin.define("Minus.Global",
{
	members:
	{
		MINUS:
		{
			API:
			{
				KEY: 'a26062a18e422a6bd5ada775c2f03e',
				SECRET: 'b13f9cb869a03cccfa320822a3bb4f'
			}
		},
		
		IMG:
		{
			IMG_PATH 			: '../Res/images/',
			HEAD_PATH			: '../Res/images/header/',
			FOOT_PATH			: '../Res/images/footer/'
		},
		
		APP:
		{
			APPID				: Osp.App.Application.getAppId(),
			APPNAME				: Osp.App.Application.getAppName(),
			APPVERSION			: Osp.App.Application.getAppVersion()
		},
		
		ACTIONID: 
		{
			// Start
			LOGIN				: 1,
			CANCEL				: 2,
			REGISTER			: 3,
			// Footer
			HOMEPAGE			: 11,
			USERPAGE			: 12,
			MSGPAGE				: 13,
			SETTINGSPAGE		: 14,
			// Main
			ADDFOLDER			: 50,
			PUBLICNO			: 55,
			PUBLICYES			: 56,
			ADDFILESNO			: 57,
			ADDFILESYES			: 58,
			FOLDERADDING		: 59,
			FOLDERCANCEL		: 60,
			ADDFILE				: 70,
			FILECANCEL			: 75,
			UPLOADFILE			: 80,
			// Settings
			SAVE				: 100,
			REMOVE				: 101,
			AUTOLOGINOFF		: 102,
			AUTOLOGINON			: 103,
			SELECTED			: 104,
			SHOWINFO			: 105,
			// User
			FACEBOOK			: 200,
			TWITTER				: 201,
			INVITE				: 202,
			EDIT				: 203,
			SENDINVITE			: 204,
			CANCELINVITE		: 205,
			// Message
			NEWMSG				: 300,
			SEND				: 301,
			ABORT				: 302,
			OPENSEARCH			: 303,
			MSGUSERSEARCH		: 304,
			MSGUSERSEARCHCLEAR	: 305,
			BACKMESSAGES		: 306,
			BACKPROFILE			: 307
		},
		
		onFooterAction: function(e) {
			switch (e.getData().actionId)
			{
				case this.ACTIONID.HOMEPAGE:
					if(sessionStorage.getItem("activePage") == "mainPage")
					{
						this.mainHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "filesPage")
					{
						this.mainFilesHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "userPage")
					{
						this.userHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "settingsPage")
					{
						this.settingsHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else
					{
						this.messageHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					this.getFolders();
					break;
				case this.ACTIONID.USERPAGE:
					if(sessionStorage.getItem("activePage") == "mainPage")
					{
						this.mainHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "filesPage")
					{
						this.mainFilesHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "userPage")
					{
						this.userHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "settingsPage")
					{
						this.settingsHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else
					{
						this.messageHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					this.initUser();
					this.userFooter.setItemSelected(1);
					break;
				case this.ACTIONID.MSGPAGE:
					if(sessionStorage.getItem("activePage") == "mainPage")
					{
						this.mainHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "filesPage")
					{
						this.mainFilesHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "userPage")
					{
						this.userHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "settingsPage")
					{
						this.settingsHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else
					{
						this.messageHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					this.getMessages();
					break;
				case this.ACTIONID.SETTINGSPAGE:
					if(sessionStorage.getItem("activePage") == "mainPage")
					{
						this.mainHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "filesPage")
					{
						this.mainFilesHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "userPage")
					{
						this.userHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else if(sessionStorage.getItem("activePage") == "settingsPage")
					{
						this.settingsHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					else
					{
						this.messageHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					}
					this.initSettings();
					this.settingsFooter.setItemSelected(3);
					break;
				default:
					break;
			}
		},
		
		onHeaderAction: function(e) {
			switch (e.getData().actionId)
			{
				// Home
				case this.ACTIONID.ADDFOLDER:
					if(this.newFolderPanel.isVisible() == true)
					{
						this.mainHeader.setTitleIcon(this.IMG.HEAD_PATH+"folder.png");
						this.mainHeader.setTitleText(this.LANG.FOLDERS);
						this.folderList.setVisible(true);
						this.newFolderPanel.setVisible(false);
					}
					else
					{
						this.mainHeader.setTitleIcon(this.IMG.HEAD_PATH+"addFolder.png");
						this.mainHeader.setTitleText(this.LANG.ADDFOLDER);
						this.folderList.setVisible(false);
						this.newFolderPanel.setVisible(true);
					}
					break;
				case this.ACTIONID.ADDFILE:
					this.initUpload();
					break;			
				case this.ACTIONID.FILECANCEL:
					this.fileCaption.setText("");
					this.fileName.setText("");
					if(this.newFilePanel.isVisible() == true)
					{
						this.mainFilesHeader.setTitleIcon(this.IMG.HEAD_PATH+"folder.png");
						this.mainFilesHeader.setTitleText(localStorage.getItem("folderName"));
						this.filesList.setVisible(true);
						this.newFilePanel.setVisible(false);
					}
					else
					{
						this.mainFilesHeader.setTitleIcon(this.IMG.HEAD_PATH+"addFile.png");
						this.mainFilesHeader.setTitleText(this.LANG.ADDFILE);
						this.filesList.setVisible(false);
						this.newFilePanel.setVisible(true);
					}				
					break;				
				// Messages
				case this.ACTIONID.NEWMSG:
					this.messageHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					this.createNewMessage();
					break;
				case this.ACTIONID.OPENSEARCH:
					if(this.searchPanel.isVisible() == true) {
						this.searchPanel.setVisible(false);
						this.statusBar.setVisible(true);
					}
					else {
						this.searchPanel.setVisible(true);
						this.statusBar.setVisible(false);
					}
					break;
				case this.ACTIONID.BACKMESSAGES:
					this.messageHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					this.getMessages();
					break;
				// Settings
				case this.ACTIONID.SHOWINFO:
					this.initInfo();
					break;
				// User
				case this.ACTIONID.EDIT:
					this.initEditUser();
					break;	
				default:
					break;
			}
		},
		
		onButtonAction: function(e) {
			switch (e.getData().actionId)
			{
				// START
				case this.ACTIONID.LOGIN:
					this.newUsername = this.loginNameField.getText();
					this.newPassword = this.loginPassField.getText();
					this.headerObj.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					if(this.newUsername == "" && this.newPassword == "") {
						alert(this.LANG.ERROR.NOLOGINDATA);
						Osp.Core.Function.delay(this.launch, 2000, this);
					}
					else if(this.newUsername == "") {
						alert(this.LANG.ERROR.NOUSERNAME);
						Osp.Core.Function.delay(this.launch, 2000, this);
					}
					else if(this.newPassword == "") {
						alert(this.LANG.ERROR.NOPASSWORD);
						Osp.Core.Function.delay(this.launch, 2000, this);
					}
					else {
						this.loginNameField.setEnabled(false);
						this.loginPassField.setEnabled(false);
						this.loginButton.setEnabled(false);
						this.cancelButton.setEnabled(false);
						this.registerButton.setEnabled(false);
						this.APIConnect();
					}
					break;
				case this.ACTIONID.CANCEL:
					this.launch();
					break;
				case this.ACTIONID.REGISTER:
					try
					{
						var appControlObject = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.browser", "osp.appcontrol.operation.view");
						if (appControlObject !== undefined && appControlObject !== null) 
						{
							var datalist = [];
							datalist[0] = "url:http://min.us/rbl01Gyg";
							appControlObject.start(datalist, null);	
						}
					}
					catch(e)
					{
						alert("Exception");
					}
					break;
				// MAIN
				case this.ACTIONID.FOLDERADDING:
					var folderName = this.folderNameField.getText();
					if(folderName == "")
					{
						alert(Osp.App.AppResource.getString("IDS_ERROR_NOFOLDERNAME"));
					}
					else
					{
						this.mainHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
						this.createFolderNow();
					}
					break;
				case this.ACTIONID.UPLOADFILE:
					this.initUpload();
					break;					
				case this.ACTIONID.FOLDERCANCEL:
					this.folderNameField.setText("");
					if(this.folderPublicControl.isSelected() || this.folderContentControl.isSelected())
					{	
						this.folderPublicControl.setSelected(false);
						this.folderContentControl.setSelected(false);
					}
					if(this.newFolderPanel.isVisible() == true)
					{
						this.mainHeader.setTitleIcon(this.IMG.HEAD_PATH+"folder.png");
						this.mainHeader.setTitleText(this.LANG.FOLDER);
						this.folderList.setVisible(true);
						this.newFolderPanel.setVisible(false);
					}
					else
					{
						this.mainHeader.setTitleIcon(this.IMG.HEAD_PATH+"addFolder.png");
						this.mainHeader.setTitleText(this.LANG.ADDFOLDER);
						this.folderList.setVisible(false);
						this.newFolderPanel.setVisible(true);
					}
					break;					
				// PROFILE
				case this.ACTIONID.FACEBOOK:
					try
					{
						var appControlObject = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.browser", "osp.appcontrol.operation.view");
						
						if (appControlObject !== undefined && appControlObject !== null) 
						{
							var datalist = [];
							datalist[0] = "url:"+localStorage.getItem("fb_profile_link");
							appControlObject.start(datalist, null);	
						}
					}
					catch(e)
					{
						alert("Exception");
					}
					break;
				case this.ACTIONID.TWITTER:
					try
					{
						var appControlObject = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.browser", "osp.appcontrol.operation.view");
						
						if (appControlObject !== undefined && appControlObject !== null) 
						{
							var datalist = [];
							datalist[0] = "url:http://www.twitter.com/"+localStorage.getItem("twitter_screen_name");
							appControlObject.start(datalist, null);	
						}
					}
					catch(e)
					{
						alert("Exception");
					}
					break;
				case this.ACTIONID.INVITE:
					this.openInviter();
					break;
				case this.ACTIONID.SENDINVITE:
					if(Osp.Core.Check.isEmail(this.inviteEmail.getText()))
					{
						alert("valid email adress");
					}
					else
					{
						alert("invalid email adress");
					}
					break;
				case this.ACTIONID.CANCELINVITE:
					this.inviteEmail.setText("");
					this.inviteTextArea.setText("");
					this.openInviter();
					break;					
				// MESSAGES
				case this.ACTIONID.MSGUSERSEARCH:
					if(this.searchField.getText() == "")
					{
						alert(this.LANG.ERROR.NOUSERNAME);
					}
					else
					{
						this.messageHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
						this.getMessagesFromUser();
					}
					break;
				case this.ACTIONID.MSGUSERSEARCHCLEAR:
					this.searchField.setText("");
					if(this.searchPanel.isVisible() == true)
					{
						this.searchPanel.setVisible(false);
						this.statusBar.setVisible(true);
					}
					else {
						this.searchPanel.setVisible(true);
						this.statusBar.setVisible(false);
					}
					break;				
				case this.ACTIONID.SEND:
					this.newMessageHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					this.sendNow();
					break;
				case this.ACTIONID.ABORT:
					this.createNewMessage();
					break;
				// SETTINGS
				case this.ACTIONID.SAVE:
					this.Username = this.loginNewNameField.getText();
					this.Password = this.loginNewPassField.getText();
					this.newSignature = this.setSignatureField.getText();
					if(this.Username == "" && this.Password == "") {
						alert(this.LANG.ERROR_NOLOGINDATA);
					}
					else if(this.Username == "") {
						alert(this.LANG.ERROR_NOUSERNAME);
						localStorage.setItem("Password", this.Password);
						Osp.Core.Function.delay(this.initSettings, 2000, this);
					}
					else if(this.Password == "") {
						alert(this.LANG.ERROR_NOPASSWORD);
						localStorage.setItem("Username", this.Username);
						Osp.Core.Function.delay(this.initSettings, 2000, this);
					}
					else {
						localStorage.setItem("Username", this.Username);
						localStorage.setItem("Password", this.Password);
						localStorage.setItem("Signature", this.newSignature);
						appObj = new Minus(frameObj);
						appObj.launch();
					}
					break;
				case this.ACTIONID.REMOVE:
					localStorage.clear();
					this.loginNewNameField.setText("");
					this.loginNewPassField.setText("");
					break;
				default:
					break;
			}
		},
		
		onCheckButtonAction: function(e) {
			switch (e.getData().actionId)
			{
				case this.ACTIONID.PUBLICNO:
					var state = "no";
					localStorage.setItem("publicMode", state);
					break;
				case this.ACTIONID.PUBLICYES:
					var state = "yes";
					localStorage.setItem("publicMode", state);
					break;
				case this.ACTIONID.ADDFILESNO:
					var state = "no";
					localStorage.setItem("addFilesMode", state);
					break;
				case this.ACTIONID.ADDFILESYES:
					var state = "yes";
					localStorage.setItem("addFilesMode", state);
					break;					
				case this.ACTIONID.AUTOLOGINOFF:
					var state = "off";
					localStorage.setItem("autoLogin", state);
					break;
				case this.ACTIONID.AUTOLOGINON:
					var state = "on";
					localStorage.setItem("autoLogin", state);
					break;		
				case this.ACTIONID.SELECTED:
					console.log("Nothing to do! :D");
					break;					
				default:
					break;
			}
		}
	}
});