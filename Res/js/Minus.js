var resultArray = new Array();
Osp.Core.Class.define("Minus",
{
	extend : Osp.Core.Object,
	include 	: [Minus.Language, Minus.Global, Minus.Style, Minus.User, Minus.Message, Minus.Settings, Minus.Main], 
	construct 	: function(frameObj) 
	{
		this.frameObj = Osp.Ui.Controls.Frame.getInstance();
	},	
	
	members :
	{	
		launch : function()
		{
			this.mainForm = new Osp.Ui.Controls.Form({style:Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.FOOTER});
			this.mainForm.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.frameObj.addControl(this.mainForm);
			this.frameObj.setCurrentForm(this.mainForm);
			this.createHeader();
			this.createFooter();
			this.createLogin();
			if(localStorage.getItem("Username") != null && localStorage.getItem("Password") != null)
			{
				if(localStorage.getItem("autoLogin") == "on")
				{
					this.headerObj.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
					this.loginNameField.setText(localStorage.getItem("Username"));
					this.loginPassField.setText(localStorage.getItem("Password"));
					this.loginNameField.setEnabled(false);
					this.loginPassField.setEnabled(false);
					this.loginButton.setEnabled(false);
					this.cancelButton.setEnabled(false);
					this.registerButton.setEnabled(false);				
					this.APIConnect();
				}
				else
				{
					this.loginNameField.setText(localStorage.getItem("Username"));
					this.loginPassField.setText(localStorage.getItem("Password"));
					this.loginNameField.setEnabled(true);
					this.loginPassField.setEnabled(true);
					this.loginButton.setEnabled(true);
					this.cancelButton.setEnabled(true);
					this.registerButton.setEnabled(true);
				}
			}
		},
		
		launchAfterError : function()
		{
			this.mainForm = new Osp.Ui.Controls.Form({style:Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.FOOTER});
			this.mainForm.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.frameObj.addControl(this.mainForm);
			this.frameObj.setCurrentForm(this.mainForm);
			this.createHeader();
			this.createFooter();
			this.createLogin();
			if(localStorage.getItem("Username") != null && localStorage.getItem("Password") != null)
			{
				this.loginNameField.setText(localStorage.getItem("Username"));
				this.loginPassField.setText(localStorage.getItem("Password"));
			}
		},
		
		createHeader: function() {
			this.headerObj = this.mainForm.getHeader();
			this.headerObj.setTitleText(this.APP.APPNAME);
			this.headerObj.setTitleTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.headerObj.setTitleIcon(this.IMG.HEAD_PATH+"logo.png");
			this.headerObj.setColor(this.STYLE.BACKGROUND.HEADER);
		},
		
		createLogin: function() {
			this.infoLabel = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 10, width: 420, height: 155},
				text: this.LANG.STARTINFO,
				multiLine: true
			});
			this.infoLabel.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.infoLabel.setTextHorizontalAlignment('center');
			this.infoLabel.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);

			this.loginNameField = new Osp.Ui.Controls.EditField({
				bounds: {x: 30, y: 185, width: 420,	height:78},
                limitLength: 16,
                editFieldStyle: "text",
                groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
                editFieldTitleStyle: Osp.Ui.Controls.EditFieldTitleStyle.TOP,
                showTitle: true
			});
			this.loginNameField.setTitleText(this.LANG.USERNAME);
			
			this.loginPassField = new Osp.Ui.Controls.EditField({
				bounds: {x: 30, y: 300, width: 420, height: 78},
                limitLength: 16,
                editFieldStyle: "password",
                groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
                editFieldTitleStyle: Osp.Ui.Controls.EditFieldTitleStyle.TOP,
                showTitle: true
			});
			this.loginPassField.setTitleText(this.LANG.PASSWORD);

			this.loginButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.LOGIN,
				text: this.LANG.LOGIN,
				bounds: {x: 30,	y: 420,	width: 200, height: 60}
			});
			this.cancelButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.CANCEL,
				text: this.LANG.CANCEL,
				bounds: {x: 250, y: 420, width: 200, height: 60}
			});
			this.registerButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.REGISTER,
				text: this.LANG.REGISTER,
				bounds: {x: 30,	y: 490,	width: 420,	height: 60}
			});

			this.loginButton.addListener("actionPerform", this.onButtonAction, this);
			this.cancelButton.addListener("actionPerform", this.onButtonAction, this);
			this.registerButton.addListener("actionPerform", this.onButtonAction, this);

			this.mainForm.addControl(this.infoLabel);
			this.mainForm.addControl(this.loginNameField);
			this.mainForm.addControl(this.loginPassField);
			this.mainForm.addControl(this.loginButton);
			this.mainForm.addControl(this.cancelButton);
			this.mainForm.addControl(this.registerButton);
		},
		
		createFooter: function() {
			this.footerObj = this.mainForm.getFooter();
			this.footerObj.setColor(this.STYLE.BACKGROUND.FOOTER);
			this.footerObj.setBackButton();
			this.footerObj.setButtonColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.footerObj.addListener("formBackRequest", this.exitApp, this);
		},
		
		exitApp: function() {
			Osp.App.Application.terminate();
		},
		
		/*
		 * establish API Connection to Minus.com
		 */
		APIConnect: function() {
			var loginUsername = this.loginNameField.getText();
			var loginPassword = this.loginPassField.getText();
			var accessAJAX = new Osp.Core.Ajax({
				'url': 'https://minus.com/oauth/token?grant_type=password&client_id='+this.MINUS.API.KEY+'&client_secret='+this.MINUS.API.SECRET+'&scope=read_public+read_all+upload_new+modify_all+modify_user&username='+loginUsername+'&password='+loginPassword,	
				'method' : 'POST',
				'requestHeaders':
				{
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				'success' : function(responseContent)
				{
					localStorage.setItem("Username", loginUsername);
					localStorage.setItem("Password", loginPassword);
					localStorage.setItem("AccessToken", JSON.parse(responseContent).access_token);
				},
				'failed' : function()
				{
					if(accessAJAX.returnStatusCode() == 400)
					{
						alert(Osp.App.AppResource.getString("IDS_ERROR_UNKNOWN"));
					}
					else if(accessAJAX.returnStatusCode() == 401)
					{
						alert(Osp.App.AppResource.getString("IDS_ERROR_LOGINFAILED"));
					}
					else
					{
						alert(Osp.App.AppResource.getString("IDS_ERROR_NETWORK"));
					}
				}
			});
			accessAJAX.send();
			
			accessAJAX.addListener("completed", this.logMeIn, this);
			accessAJAX.addListener("failed", this.launchAfterError, this);
		},
		
		/*
		 * Login to Minus.com
		 */
		logMeIn: function() {
			var loginAJAX = new Osp.Core.Ajax({
				'url': 'https://minus.com/api/v2/activeuser?bearer_token='+localStorage.getItem("AccessToken"),
				'method' : 'GET',
				'success' : function(response)
				{
					var profileDB = JSON.parse(response);
					localStorage.setItem("username", profileDB.username); //
					//localStorage.setItem("folders", profileDB.folders);
					localStorage.setItem("inviteURL", profileDB.invite_url);
					localStorage.setItem("displayName", profileDB.display_name); //
					localStorage.setItem("description", profileDB.description); //
					
					localStorage.setItem("followers_slug_list", profileDB.followers_slug_list);
					//localStorage.setItem("url", profileDB.url);
					localStorage.setItem("storage_quota", profileDB.storage_quota); //
					localStorage.setItem("visits", profileDB.visits); //
					localStorage.setItem("fb_username", profileDB.fb_username); //
					
					localStorage.setItem("storage_used", profileDB.storage_used); //
					localStorage.setItem("avatar", profileDB.avatar); //
					localStorage.setItem("following_slug_list", profileDB.following_slug_list);
					//localStorage.setItem("followers", profileDB.followers);
					localStorage.setItem("karma", profileDB.karma); //

					//localStorage.setItem("following", profileDB.following);
					localStorage.setItem("shared", profileDB.shared); //
					localStorage.setItem("fb_profile_link", profileDB.fb_profile_link); //
					localStorage.setItem("slug", profileDB.slug);
					localStorage.setItem("twitter_screen_name", profileDB.twitter_screen_name); //
				},
				'failed' : function(){
					alert(Osp.App.AppResource.getString("IDS_ERROR_LOGINFAILED"));
				}
			});
			loginAJAX.send();
			loginAJAX.addListener("completed", this.getFolders, this);
			loginAJAX.addListener("failed", this.launchAfterError, this);
		},
		/*
		 * Get userfolders
		 */
		getFolders: function() {
			var folderAJAX = new Osp.Core.Ajax({
				'url': 'https://minus.com/api/v2/users/'+localStorage.getItem("slug")+'/folders?bearer_token='+localStorage.getItem("AccessToken"),
				'method' : 'GET',
				'success' : function(response)
				{
					var folderObject = JSON.parse(response);
					localStorage.setItem("fld_complete", response);
					localStorage.setItem("fld_page", folderObject.page);
					localStorage.setItem("fld_next", folderObject.next);
					localStorage.setItem("fld_perpage", folderObject.perpage);
					localStorage.setItem("fld_total", folderObject.total);
					localStorage.setItem("fld_pages", folderObject.pages);
					localStorage.setItem("fld_previous", folderObject.previous);
				},
				'failed' : function(){
					alert(Osp.App.AppResource.getString("IDS_ERROR_FOLDERLOADFAILED"));
				}
			});
			folderAJAX.send();
			folderAJAX.addListener("completed", this.initMain, this);
			folderAJAX.addListener("failed", this.initMain, this);
		}
	}
});