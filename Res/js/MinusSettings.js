Osp.Core.Mixin.define("Minus.Settings",
{
	members:
	{
		initSettings: function()
		{
			var setActivePage = "settingsPage";
			sessionStorage.setItem("activePage", setActivePage);
			this.settingsPage = new Osp.Ui.Controls.Form({
				style: Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.FOOTER
			});
			this.settingsPage.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.frameObj.addControl(this.settingsPage);
			this.frameObj.setCurrentForm(this.settingsPage);
			this.createSettingsHeader();
			this.createSettingsBody();
			this.createSettingsFooter();
		},
		
		createSettingsHeader: function() {
			this.settingsHeader = this.settingsPage.getHeader();
			this.settingsHeader.setTitleText(this.LANG.SETTINGS);
			this.settingsHeader.setTitleTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.settingsHeader.setTitleIcon(this.IMG.HEAD_PATH+"settings.png");
			this.settingsHeader.setColor(this.STYLE.BACKGROUND.HEADER);
			this.settingsHeader.setButton('left', {
				actionId: this.ACTIONID.SHOWINFO,
				icon: {
					normal: this.IMG.HEAD_PATH+"info_button.png",
					pressed: this.IMG.HEAD_PATH+"info_button_pressed.png"
				}
			});
			this.settingsHeader.setButtonColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.settingsHeader.setProgressIcon(null);
			this.settingsHeader.addListener("actionPerform", this.onHeaderAction, this);
		},
		
		createSettingsFooter: function() {
			this.settingsFooter = this.settingsPage.getFooter();
			this.settingsFooter.setColor(this.STYLE.BACKGROUND.FOOTER);
			this.settingsFooter.setFooterStyle(Osp.Ui.Controls.FooterStyle.TAB);
			this.settingsFooter.addItem({
				actionId: this.ACTIONID.HOMEPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"folder.png",
					pressed: this.IMG.FOOT_PATH+"folder_pressed.png"
				}
			});
			this.settingsFooter.addItem({
				actionId: this.ACTIONID.USERPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"user.png",
					pressed: this.IMG.FOOT_PATH+"user_pressed.png"
				}
			});
			this.settingsFooter.addItem({
				actionId: this.ACTIONID.MSGPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"message.png",
					pressed: this.IMG.FOOT_PATH+"message_pressed.png"
				}
			});
			this.settingsFooter.addItem({
				actionId: this.ACTIONID.SETTINGSPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"settings.png",
					pressed: this.IMG.FOOT_PATH+"settings_pressed.png"
				}
			});			
			this.settingsFooter.setItemColor({
				normal: this.STYLE.ITEM.COLOR.NORMAL,
				pressed: this.STYLE.ITEM.COLOR.PRESSED,
				disabled: this.STYLE.ITEM.COLOR.DISABLED,
				highlighted: this.STYLE.ITEM.COLOR.HIGHLIGHTED,
				selected: this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.settingsFooter.addListener("actionPerform", this.onFooterAction, this);
		},
		
		createSettingsBody: function() {
			this.settingsText = new Osp.Ui.Controls.Label({
				 bounds: {x: 30, y: 10, width: 420, height: 70},
				text: this.LANG.SETTINGSINFO,
				multiLine: true
			});
			this.settingsText.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.settingsText.setTextHorizontalAlignment('center');
			this.settingsText.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			
			this.loginNewNameField = new Osp.Ui.Controls.EditField({
				bounds: {x:30, y:90, width:420, height:78},
                limitLength: 16,
                editFieldStyle: "text",
                groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
                editFieldTitleStyle: Osp.Ui.Controls.EditFieldTitleStyle.TOP,
                showTitle: true
			});
			this.loginNewNameField.setTitleText(this.LANG.USERNAME);
			this.loginNewNameField.setText(localStorage.getItem("Username"));
			
			// password field
			this.loginNewPassField = new Osp.Ui.Controls.EditField({
				bounds: {x:30, y:200, width:420, height:78},
                limitLength: 16,
                editFieldStyle: "password",
                groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
                editFieldTitleStyle: Osp.Ui.Controls.EditFieldTitleStyle.TOP,
                showTitle: true
			});
			this.loginNewPassField.setTitleText(this.LANG.PASSWORD);
			this.loginNewPassField.setText(localStorage.getItem("Password"));
			
			this.autoLoginControl = new Osp.Ui.Controls.CheckButton({
				bounds :{x: 30, y: 310, width: 420, height: 72},
				style: "onoff",
				groupStyle: "single",
				backgroundStyle: "default",
                text:this.LANG.AUTOLOGIN
            });
			this.autoLoginControl.setTextColor(this.STYLE.LABEL.COLOR.WHITE);
			this.autoLoginControl.setActionId(this.ACTIONID.AUTOLOGINON, this.ACTIONID.AUTOLOGINOFF, this.ACTIONID.SELECTED);
			if(localStorage.getItem("autoLogin") == "on")
			{
				this.autoLoginControl.setSelected(true);
			}
			this.autoLoginControl.addListener("actionPerform", this.onCheckButtonAction, this);
						
			this.setSignatureField = new Osp.Ui.Controls.EditField({
				bounds: {x:30, y: 415, width:420, height:78},
                limitLength: 48,
                editFieldStyle: "text",
                groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
                editFieldTitleStyle: Osp.Ui.Controls.EditFieldTitleStyle.TOP,
                showTitle: true
			});
			this.setSignatureField.setTitleText(this.LANG.SIGNATURE);
			if(localStorage.getItem("Signature") == null)
			{
				var defaultSignature = "via Minus for bada";
				localStorage.setItem("Signature", defaultSignature);
				this.setSignatureField.setText(defaultSignature);
			}
			else
			{
				this.setSignatureField.setText(localStorage.getItem("Signature"));
			}
			
			this.saveButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.SAVE,
				text: this.LANG.SAVE,
				bounds: {x: 30,	y: 530,	width: 200, height: 60}
			});
			this.removeButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.REMOVE,
				text: this.LANG.REMOVE,
				bounds: {x: 250, y: 530, width:200,	height:60}
			});
			
			this.saveButton.addListener("actionPerform", this.onButtonAction, this);
			this.removeButton.addListener("actionPerform", this.onButtonAction, this);		

			this.settingsPage.addControl(this.settingsText);
			this.settingsPage.addControl(this.loginNewNameField);
			this.settingsPage.addControl(this.loginNewPassField);
			this.settingsPage.addControl(this.setSignatureField);
			this.settingsPage.addControl(this.autoLoginControl);
			this.settingsPage.addControl(this.saveButton);
			this.settingsPage.addControl(this.removeButton);
		},
		
		/*
		 * Create Page [About]
		 */
		initInfo: function() {
			this.infoPage = new Osp.Ui.Controls.Form({
				style: Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.FOOTER
			});
			this.infoPage.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.frameObj.addControl(this.infoPage);
			this.frameObj.setCurrentForm(this.infoPage);
			this.createInfoHeader();
			this.createInfoBody();
			this.createInfoFooter();
		},
		
		createInfoHeader: function() {
			this.infoHeader = this.infoPage.getHeader();
			this.infoHeader.setTitleText(this.LANG.INFO);
			this.infoHeader.setTitleTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.infoHeader.setTitleIcon(this.IMG.HEAD_PATH+"info.png");
			this.infoHeader.setColor(this.STYLE.BACKGROUND.HEADER);
		},
		
		createInfoFooter: function() {
			this.infoFooter = this.infoPage.getFooter();
			this.infoFooter.setColor(this.STYLE.BACKGROUND.FOOTER);
			this.infoFooter.setBackButton();
			this.infoFooter.setButtonColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.infoFooter.addListener("formBackRequest", this.backToSettings, this);
		},
		
		createInfoBody: function() {
			this.minusLogo = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 10, width: 420, height: 114},
				text: "",
				multiLine: false
			});
			this.minusLogo.setBackgroundImage(this.IMG.IMG_PATH+"logo.png");

			this.AppVersion = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 125, width: 420,	height: 40},
				text: "Version: "+this.APP.APPVERSION+" Beta",
				multiLine: false
			});
			this.AppVersion.setTextColor(this.STYLE.TITLE.COLOR.ALT);
			this.AppVersion.setTextHorizontalAlignment('center');
			this.AppVersion.setTextSize(this.STYLE.LABEL.SIZE.LARGE);
			this.AppVersion.setTextWeight('bold');
			
			this.infoCredits = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 180, width: 420, height: 40},
				text: this.LANG.CREDITS,
				multiLine: false
			});
			this.infoCredits.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.infoCredits.setTextHorizontalAlignment('center');
			this.infoCredits.setTextSize(this.STYLE.LABEL.SIZE.LARGE);
			this.infoCredits.setTextWeight('bold');
			
			this.creditsScrollPanel = new Osp.Ui.Controls.ScrollPanel({
				bounds: {x: 0, y: 225, width: 480, height: 380}
			});
			this.creditsScrollPanel.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			
			this.infoPage.addControl(this.minusLogo);
			this.infoPage.addControl(this.AppVersion);
			this.infoPage.addControl(this.infoCredits);
			this.infoPage.addControl(this.creditsScrollPanel);
			
			this.ProjectLeader = new Osp.Ui.Controls.Label({
				bounds: {x: 30,	y: 10, width: 420, height: 30},
				text: "Project Leader",
				multiLine: false
			});
			this.ProjectLeader.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.ProjectLeader.setTextHorizontalAlignment('center');
			this.ProjectLeader.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			this.ProjectLeader.setTextWeight('bold');
			
			this.ProjectLeaderName = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 50, width: 420, height: 30},
				text: "Marco Büttner",
				multiLine: false
			});
			this.ProjectLeaderName.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.ProjectLeaderName.setTextHorizontalAlignment('center');
			this.ProjectLeaderName.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			
			this.LeadProgrammer = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 100, width: 420, height: 30},
				text: "Lead Programmer",
				multiLine: false
			});
			this.LeadProgrammer.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.LeadProgrammer.setTextHorizontalAlignment('center');
			this.LeadProgrammer.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			this.LeadProgrammer.setTextWeight('bold');
			
			this.LeadProgrammerName = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 140, width: 420, height: 30},
				text: "Marco Büttner",
				multiLine: false
			});
			this.LeadProgrammerName.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.LeadProgrammerName.setTextHorizontalAlignment('center');
			this.LeadProgrammerName.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			
			this.Programmer = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 190, width: 420, height: 30},
				text: "Programmers",
				multiLine: false
			});
			this.Programmer.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.Programmer.setTextHorizontalAlignment('center');
			this.Programmer.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			this.Programmer.setTextWeight('bold');
			
			this.ProgrammerNameLeft = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 230,	width: 420, height: 30},
				text: "Pierre Kretschmar",
				multiLine: false
			});
			this.ProgrammerNameLeft.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.ProgrammerNameLeft.setTextHorizontalAlignment('left');
			this.ProgrammerNameLeft.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.ProgrammerNameRight = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 230, width: 420, height: 30},
				text: "Steve Hofmann ",
				multiLine: false
			});
			this.ProgrammerNameRight.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.ProgrammerNameRight.setTextHorizontalAlignment('right');
			this.ProgrammerNameRight.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.Tester = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 280, width: 420, height: 30},
				text: "Test-Team",
				multiLine: false
			});
			this.Tester.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.Tester.setTextHorizontalAlignment('center');
			this.Tester.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			this.Tester.setTextWeight('bold');
			
			this.TesterNameUpLeft = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 320, width: 420, height: 30},
				text: "Andreas Hubenthal",
				multiLine: false
			});
			this.TesterNameUpLeft.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.TesterNameUpLeft.setTextHorizontalAlignment('left');
			this.TesterNameUpLeft.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.TesterNameUpRight = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 320, width: 420,	height: 30},
				text: "Sebastian Beermann ",
				multiLine: false
			});
			this.TesterNameUpRight.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.TesterNameUpRight.setTextHorizontalAlignment('right');
			this.TesterNameUpRight.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.TesterNameMidLeft = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 355, width: 420, height: 30},
				text: "Tim W.",
				multiLine: false
			});
			this.TesterNameMidLeft.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.TesterNameMidLeft.setTextHorizontalAlignment('left');
			this.TesterNameMidLeft.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.TesterNameMidRight = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 355, width: 420,	height: 30},
				text: "Matthias Schleusener ",
				multiLine: false
			});
			this.TesterNameMidRight.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.TesterNameMidRight.setTextHorizontalAlignment('right');
			this.TesterNameMidRight.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.TesterNameBottomLeft = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 390, width: 420, height: 30},
				text: "Matthias Knoth",
				multiLine: false
			});
			this.TesterNameBottomLeft.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.TesterNameBottomLeft.setTextHorizontalAlignment('left');
			this.TesterNameBottomLeft.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.TesterNameBottomRight = new Osp.Ui.Controls.Label({
				bounds: {x: 30,	y: 390,	width: 420,	height: 30},
				text: " ",
				multiLine: false
			});
			this.TesterNameBottomRight.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.TesterNameBottomRight.setTextHorizontalAlignment('right');
			this.TesterNameBottomRight.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.Thanks = new Osp.Ui.Controls.Label({
				bounds: {x: 30,	y: 440,	width: 420,	height: 30},
				text: "Special Thanks",
				multiLine: false
			});
			this.Thanks.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.Thanks.setTextHorizontalAlignment('center');
			this.Thanks.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			this.Thanks.setTextWeight('bold');
			
			this.ThanksNameLeft = new Osp.Ui.Controls.Label({
				bounds: {x: 30,	y: 480,	width: 420,	height: 30},
				text: "John Xie (Minus)",
				multiLine: false
			});
			this.ThanksNameLeft.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.ThanksNameLeft.setTextHorizontalAlignment('left');
			this.ThanksNameLeft.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.ThanksNameRight = new Osp.Ui.Controls.Label({
				bounds: {x: 30,	y: 480,	width: 420,	height: 30},
				text: "Jan Schüssler (Samsung) ",
				multiLine: false
			});
			this.ThanksNameRight.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.ThanksNameRight.setTextHorizontalAlignment('right');
			this.ThanksNameRight.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.ThanksNameMidLeft = new Osp.Ui.Controls.Label({
				bounds: {x: 30,	y: 515,	width: 420,	height: 30},
				text: "Adam Szatrowski (Minus)",
				multiLine: false
			});
			this.ThanksNameMidLeft.setTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.ThanksNameMidLeft.setTextHorizontalAlignment('left');
			this.ThanksNameMidLeft.setTextSize(this.STYLE.LABEL.SIZE.SMALL);
			
			this.creditsScrollPanel.addControl(this.ProjectLeader);
			this.creditsScrollPanel.addControl(this.ProjectLeaderName);
			this.creditsScrollPanel.addControl(this.LeadProgrammer);
			this.creditsScrollPanel.addControl(this.LeadProgrammerName);			
			this.creditsScrollPanel.addControl(this.Programmer);
			this.creditsScrollPanel.addControl(this.ProgrammerNameLeft);
			this.creditsScrollPanel.addControl(this.ProgrammerNameRight);
			this.creditsScrollPanel.addControl(this.Tester);
			this.creditsScrollPanel.addControl(this.TesterNameUpLeft);
			this.creditsScrollPanel.addControl(this.TesterNameUpRight);
			this.creditsScrollPanel.addControl(this.TesterNameMidLeft);
			this.creditsScrollPanel.addControl(this.TesterNameMidRight);
			this.creditsScrollPanel.addControl(this.TesterNameBottomLeft);
			this.creditsScrollPanel.addControl(this.TesterNameBottomRight);
			this.creditsScrollPanel.addControl(this.Thanks);
			this.creditsScrollPanel.addControl(this.ThanksNameLeft);
			this.creditsScrollPanel.addControl(this.ThanksNameRight);
			this.creditsScrollPanel.addControl(this.ThanksNameMidLeft);
		},
		
		backToSettings: function() {
			this.initSettings();
			this.settingsFooter.setItemSelected(3);
		}
	}
});