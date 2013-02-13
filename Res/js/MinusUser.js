Osp.Core.Mixin.define("Minus.User",
{
	members: 
	{
		initUser: function() {
			var setActivePage = "userPage";
			sessionStorage.setItem("activePage", setActivePage);
			this.userPage = new Osp.Ui.Controls.Form({
				style: Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.FOOTER
			});
			this.userPage.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.frameObj.addControl(this.userPage);
			this.frameObj.setCurrentForm(this.userPage);
			this.createUserHeader();
			this.createUserBody();
			this.inviteBody();
			this.createUserFooter();
		},
		
		createUserHeader: function() {
			this.userHeader = this.userPage.getHeader();
			this.userHeader.setTitleText(this.LANG.PROFILE+" "+this.LANG.OF+" "+localStorage.getItem("Username"));
			this.userHeader.setTitleTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.userHeader.setTitleIcon(this.IMG.HEAD_PATH+"user.png");
			this.userHeader.setColor(this.STYLE.BACKGROUND.HEADER);
			/*
			this.userHeader.setButton('right', {
				actionId: this.ACTIONID.EDIT,
				icon: {
					normal: this.IMG.HEAD_PATH+"edit_button.png",
					pressed: this.IMG.HEAD_PATH+"edit_button_pressed.png"
				}
			});
			this.userHeader.setButtonColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			*/
			this.userHeader.setProgressIcon(null);
			this.userHeader.addListener("actionPerform", this.onHeaderAction, this);
		},
		
		createUserFooter: function() {
			this.userFooter = this.userPage.getFooter();
			this.userFooter.setColor(this.STYLE.BACKGROUND.FOOTER);
			this.userFooter.setFooterStyle(Osp.Ui.Controls.FooterStyle.TAB);
			this.userFooter.addItem({
				actionId: this.ACTIONID.HOMEPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"folder.png",
					pressed: this.IMG.FOOT_PATH+"folder_pressed.png"
				}
			});
			this.userFooter.addItem({
				actionId: this.ACTIONID.USERPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"user.png",
					pressed: this.IMG.FOOT_PATH+"user_pressed.png"
				}
			});
			this.userFooter.addItem({
				actionId: this.ACTIONID.MSGPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"message.png",
					pressed: this.IMG.FOOT_PATH+"message_pressed.png"
				}
			});
			this.userFooter.addItem({
				actionId: this.ACTIONID.SETTINGSPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"settings.png",
					pressed: this.IMG.FOOT_PATH+"settings_pressed.png"
				}
			});			
			this.userFooter.setItemColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTE,
				selected: this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.userFooter.addListener("actionPerform", this.onFooterAction, this);
		},
		
		createUserBody: function() {
			var StorageTotal = bytesToSize(parseInt(localStorage.getItem("storage_quota")), 1);
			var StorageUsed = bytesToSize(parseInt(localStorage.getItem("storage_used")), 1);
			
			this.userPic = new Osp.Ui.Controls.Label({
				bounds: {x: 30,	y: 10, width: 100, height: 100},
				text: "",
				multiLine: false
			});
			this.userPic.setBackgroundImage(localStorage.getItem("avatar"));
			
			this.userName = new Osp.Ui.Controls.Label({
				bounds: {x: 150, y: 10, width: 310, height: 40},
				text: localStorage.getItem("displayName"),
				multiLine: false
			});
			this.userName.setTextColor(this.STYLE.LABEL.COLOR.ALT);
			this.userName.setTextSize(this.STYLE.LABEL.SIZE.LARGE);
			
			this.userDescription = new Osp.Ui.Controls.Label({
				bounds: {x: 150, y: 55,	width: 310,	height: 50},
				text: "",
				multiLine: true
			});
			this.userDescription.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.userDescription.setTextSize(20);

			if(localStorage.getItem("description") == "null")
			{
				this.userDescription.setText(this.LANG.NODESCRIPTION);
			}
			else
			{
				this.userDescription.setText(localStorage.getItem("description"));
			}

			this.fbButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.FACEBOOK,
				text: "",
				bounds: {x: 27, y: 120,	width: 50, height: 50}
			});
			this.fbButton.setBackgroundImage({
				normal: this.IMG.IMG_PATH+"facebook.png",
				pressed: this.IMG.IMG_PATH+"facebook_pressed.png",
				disabled: this.IMG.IMG_PATH+"facebook_disabled.png"
			});
			
			this.twButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.TWITTER,
				text: "",
				bounds: {x: 82, y: 120, width: 50, height: 50}
			});
			this.twButton.setBackgroundImage({
				normal: this.IMG.IMG_PATH+"twitter.png",
				pressed: this.IMG.IMG_PATH+"twitter_pressed.png",
				disabled: this.IMG.IMG_PATH+"twitter_disabled.png"
			});
			if(localStorage.getItem("fb_profile_link") != "" && localStorage.getItem("twitter_screen_name") != "")
			{
				this.fbButton.setEnabled(true);
				this.twButton.setEnabled(true);
			}
			else if(localStorage.getItem("fb_profile_link") == "" && localStorage.getItem("twitter_screen_name") != "")
			{
				this.fbButton.setEnabled(false);
				this.twButton.setEnabled(true);
			}
			else if(localStorage.getItem("fb_profile_link") != "" && localStorage.getItem("twitter_screen_name") == "")
			{
				this.fbButton.setEnabled(true);
				this.twButton.setEnabled(false);
			}
			else
			{
				this.fbButton.setEnabled(false);
				this.twButton.setEnabled(false);	
			}
			
			this.inviteButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.INVITE,
				text: "",
				bounds: {x: 404, y: 120, width: 50, height: 50}
			});
			this.inviteButton.setBackgroundImage({
				normal: this.IMG.IMG_PATH+"invite.png",
				pressed: this.IMG.IMG_PATH+"invite_pressed.png"
			});

			//this.inviteButton.setEnabled(false);
			
			this.fbButton.addListener("actionPerform", this.onButtonAction, this);
			this.twButton.addListener("actionPerform", this.onButtonAction, this);
			this.inviteButton.addListener("actionPerform", this.onButtonAction, this);
			/*
			 * Statistic
			 */			
			this.userStats = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 175, width: 420,	height: 35},
				text: this.LANG.DETAILS,
				multiLine: false
			});
			this.userStats.setTextColor(this.STYLE.LABEL.COLOR.ALT);
			this.userStats.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			this.userStats.setTextWeight('bolder');
			
			// generate ScrollPanel
			this.userStatsObj = new Osp.Ui.Controls.ScrollPanel({
				bounds: {x: 0, y: 209, width:480, height: 405}
			});
			this.userStatsObj.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			
			/*
			 * Statistic elements
			 */
			this.userStorageLabel = new Osp.Ui.Controls.Label({
				bounds: {x: 30,	y: 0, width: 420, height: 30},
				text: this.LANG.STORAGE,
				multiLine: false
			});
			this.userStorageLabel.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.userStorageLabel.setTextSize(25);
			this.userStorageLabel.setTextWeight('bold');
			this.userStorageBar = new Osp.Ui.Controls.Progress({
				bounds: {x: 30,	y: 35, width: 420, height: 25},
				range: {
					min: 0,
					max: parseInt(localStorage.getItem("storage_quota"))
				}
			});
			this.userStorageBar.setBarColor(this.STYLE.ITEM.COLOR.HIGHLIGHTED);
			this.userStorageBar.setValue(parseInt(localStorage.getItem("storage_used")));
			this.userStorageUsed = new Osp.Ui.Controls.Label({
				bounds: {x: 30,	y: 65, width: 420, height: 25},
				text: this.LANG.STORAGEUSED+": "+StorageUsed,
				multiLine: false
			});
			this.userStorageTotal = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 65, width: 420, height: 25},
				text: this.LANG.STORAGETOTAL+": "+StorageTotal+" ",
				multiLine: false
			});
			this.userStorageUsed.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.userStorageUsed.setTextSize(20);
			this.userStorageTotal.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.userStorageTotal.setTextSize(20);
			this.userStorageTotal.setTextHorizontalAlignment('right');
			
			this.userFolders = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 100, width: 420, height: 30},
				text: this.LANG.FOLDERS,
				multiLine: false
			});
			this.userFolders.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.userFolders.setTextSize(25);
			this.userFolders.setTextWeight('bold');
			
			this.userFolderTotal = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 130, width: 420, height: 25},
				text: this.LANG.TOTAL+": "+localStorage.getItem("folderCount"),
				multiLine: false
			});
			this.userFolderTotal.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.userFolderTotal.setTextSize(20);
			
			this.userFolderShared = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 130, width: 420, height: 25},
				text: this.LANG.SHARED+": "+localStorage.getItem("shared")+" ",
				multiLine: false
			});
			this.userFolderShared.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.userFolderShared.setTextSize(20);
			this.userFolderShared.setTextHorizontalAlignment('right');
			
			this.userProfileStats = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 160,	width: 210, height: 30},
				text: this.LANG.PROFILESTATS,
				multiLine: false
			});
			this.userProfileStats.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.userProfileStats.setTextSize(25);
			this.userProfileStats.setTextWeight('bold');
			
			this.userVisits = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 190, width: 420, height: 25},
				text: this.LANG.VISITS+": "+localStorage.getItem("visits"),
				multiLine: false
			});
			this.userVisits.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.userVisits.setTextSize(20);
			
			this.userKarma = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 190, width: 420, height: 25},
				text: this.LANG.KARMA+": "+localStorage.getItem("karma")+" ",
				multiLine: false
			});
			this.userKarma.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.userKarma.setTextSize(20);
			this.userKarma.setTextHorizontalAlignment('right');
			
			this.followerLabel = new Osp.Ui.Controls.Label({
				bounds: {x: 30, y: 220,	width: 200, height: 30},
				text: this.LANG.FOLLOWERS,
				multiLine: false
			});
			this.followerLabel.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.followerLabel.setTextSize(25);
			this.followerLabel.setTextWeight('bold');
			
			this.followerList = new Osp.Ui.Controls.List({
				bounds: {x: 30, y: 250, width: 200, height: 125},
				itemDivider: true,
				fastScroll: false
			});
			this.followerList.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.followerList.setTextColorOfEmptyList(this.STYLE.LABEL.COLOR.NORMAL);
			this.followerList.setItemDividerColor(this.STYLE.ITEM.COLOR.DIVIDER);
			
			var followerListResponse = localStorage.getItem("followers_slug_list");
			if(followingListResponse == "[]" || followingListResponse == "")
			{
				this.followerList.setTextOfEmptyList(this.LANG.NOFOLLOWERS);
			}
			var followerListArray = followerListResponse.split(",");
			for (var i = 0; i < followerListArray.length; i++)
			{
				var followerName = followerListArray[i];
				
				var tempItem = this.getFollowerItem(followerName);
				this.followerList.addItem(tempItem);
			}
			
			this.followingLabel = new Osp.Ui.Controls.Label({
				bounds: {x: 250, y: 220, width: 200, height: 30},
				text: this.LANG.FOLLOWING,
				multiLine: false
			});
			this.followingLabel.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.followingLabel.setTextSize(25);
			this.followingLabel.setTextWeight('bold');
			
			this.followingList = new Osp.Ui.Controls.List({
				bounds: {x: 250, y: 250, width: 200, height: 125},
				itemDivider: true,
				fastScroll: false
			});
			this.followingList.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.followingList.setTextColorOfEmptyList(this.STYLE.LABEL.COLOR.NORMAL);
			this.followingList.setItemDividerColor(this.STYLE.ITEM.COLOR.DIVIDER);
			
			var followingListResponse = localStorage.getItem("following_slug_list");
			if(followingListResponse == "[]" || followingListResponse == "")
			{
				this.followingList.setTextOfEmptyList(this.LANG.NOFOLLOWING);
			}
			var followingListArray = followingListResponse.split(",");
			for (var i = 0; i < followingListArray.length; i++)
			{
				var followingName = followingListArray[i];
				
				var tempItem = this.getFollowingItem(followingName);
				this.followingList.addItem(tempItem);
			}
			
			/*
			 * Add children to the parent [userPage]
			 */
			this.userPage.addControl(this.userPic);
			this.userPage.addControl(this.userName);
			this.userPage.addControl(this.userDescription);
			this.userPage.addControl(this.fbButton);
			this.userPage.addControl(this.twButton);
			this.userPage.addControl(this.inviteButton);
			this.userPage.addControl(this.userStats);
			this.userPage.addControl(this.userStatsObj);
			/*
			 * Add children to the parent [userStatsObj]
			 */
			this.userStatsObj.addControl(this.userStorageLabel);
			this.userStatsObj.addControl(this.userStorageBar);
			this.userStatsObj.addControl(this.userStorageUsed);
			this.userStatsObj.addControl(this.userStorageTotal);
			this.userStatsObj.addControl(this.userFolders);
			this.userStatsObj.addControl(this.userFolderTotal);
			this.userStatsObj.addControl(this.userFolderShared);
			this.userStatsObj.addControl(this.userKarma);
			this.userStatsObj.addControl(this.userProfileStats);
			this.userStatsObj.addControl(this.userVisits);
			this.userStatsObj.addControl(this.followerLabel);
			this.userStatsObj.addControl(this.followerList);
			this.userStatsObj.addControl(this.followingLabel);
			this.userStatsObj.addControl(this.followingList);
		},
		
		inviteBody: function() {
			this.invitePanel = new Osp.Ui.Controls.Panel({
				bounds: {x: 0, y: 0, width: 480, height: 614},
				groupStyle: "none"
			});
			this.invitePanel.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.invitePanel.setVisible(false);
			this.inviteEmail = new Osp.Ui.Controls.EditField({
				bounds: {x: 30, y: 10, width: 420,	height:78},
                limitLength: 48,
                editFieldStyle: "email",
                groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
                editFieldTitleStyle: Osp.Ui.Controls.EditFieldTitleStyle.TOP,
                showTitle: true
			});
			this.inviteEmail.setTitleText(this.LANG.EMAIL);
			
			this.inviteTextArea = new Osp.Ui.Controls.EditArea({
				bounds: {x: 30, y: 120, width: 420, height: 400},
				limitLength: 2048
			});
			
			this.inviteSendButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.SENDINVITE,
				text: this.LANG.SEND,
				bounds: {x: 30,	y: 535,	width: 200, height: 60}
			});
			this.inviteCancelButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.CANCELINVITE,
				text: this.LANG.CANCEL,
				bounds: {x: 250, y: 535, width: 200, height: 60}
			});

			this.inviteSendButton.addListener("actionPerform", this.onButtonAction, this);
			this.inviteCancelButton.addListener("actionPerform", this.onButtonAction, this);
			
			this.userPage.addControl(this.invitePanel);
			this.invitePanel.addControl(this.inviteEmail);
			this.invitePanel.addControl(this.inviteTextArea);
			this.invitePanel.addControl(this.inviteSendButton);
			this.invitePanel.addControl(this.inviteCancelButton);
		},
		
		getFollowerItem: function(followerName)	{
			var item =
			{
				height: 30,
				setting:
				{
					backgroundColor:
					{
						normal: '#FFFFFF',
						pressed: '#FAFAFA'
					},
					annex: Osp.Ui.Controls.ListAnnexStyle.NORMAL,
					elements: []
				}   
			};
			
			item.setting.elements.push({
				text: followerName,
				textSize: 20,
				textColor: {
					normal: '#000000',
					pressed: '#000000'
				},
				textSliding: false
			});
			return item;
		},
		
		getFollowingItem: function(followingName) {
			var item =
			{
				height: 30,
				setting:
				{
					backgroundColor:
					{
						normal: '#FFFFFF',
						pressed: '#FAFAFA'
					},
					annex: Osp.Ui.Controls.ListAnnexStyle.NORMAL,
					elements: []
				}   
			};
			
			item.setting.elements.push({
				text: followingName,
				textSize: 20,
				textColor: {
					normal: '#000000',
					pressed: '#000000'
				},
				textSliding: false
			});
			return item;
		},
		
		initEditUser: function() {
			this.editUserPage = new Osp.Ui.Controls.Form({
				style:Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.FOOTER
			});
			this.editUserPage.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.frameObj.addControl(this.editUserPage);
			this.frameObj.setCurrentForm(this.editUserPage);
			this.createEditUserHeader();
			this.createEditUserFooter();
			this.createEditUserBody();
		},
		
		createEditUserHeader: function() {
			this.editUserHeader = this.editUserPage.getHeader();
			this.editUserHeader.setTitleText(this.LANG.EDITPROFILE);
			this.editUserHeader.setTitleTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.editUserHeader.setTitleIcon(this.IMG.HEAD_PATH+"edit.png");
			this.editUserHeader.setColor(this.STYLE.BACKGROUND.HEADER);
			this.editUserHeader.setProgressIcon(null);
		},
		
		createEditUserFooter: function() {
			this.editUserFooter = this.editUserPage.getFooter();
			this.editUserFooter.setColor(this.STYLE.BACKGROUND.FOOTER);
			this.editUserFooter.setBackButton();
			this.editUserFooter.setButtonColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.editUserFooter.addListener("formBackRequest", this.backToProfile, this);			
		},
		
		createEditUserBody: function() {
			this.editUserInfo = new Osp.Ui.Controls.Label({
				 bounds: {x: 0, y: 0, width: 480, height: 35},
				text: this.LANG.EDITUSERINFO,
				multiLine: false
			});
			this.editUserInfo.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.editUserInfo.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.editUserInfo.setTextHorizontalAlignment('center');
			this.editUserInfo.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			
			this.editUserScrollObj = new Osp.Ui.Controls.ScrollPanel({
				bounds: {x:0, y: 35, width: 480, height: 579}
			});
			this.editUserScrollObj.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			
			this.editDisplayName = new Osp.Ui.Controls.EditField({
				bounds: {x: 30, y: 10, width: 420,	height:78},
                limitLength: 100,
                editFieldStyle: "text",
                groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
                editFieldTitleStyle: Osp.Ui.Controls.EditFieldTitleStyle.TOP,
                showTitle: true
			});
			this.editDisplayName.setTitleText(this.LANG.DISPLAYNAME);
			this.editDisplayName.setGuideText(localStorage.getItem("displayName"));
			
			this.editUserPage.addControl(this.editUserInfo);
			this.editUserPage.addControl(this.editUserScrollObj);
			
			this.editUserScrollObj.addControl(this.editDisplayName);
		},
		
		openInviter: function() {
			if(this.invitePanel.isVisible() == true)
			{
				this.userHeader.setTitleIcon(this.IMG.HEAD_PATH+"user.png");
				this.userHeader.setTitleText(this.LANG.PROFILE+" "+this.LANG.OF+" "+localStorage.getItem("Username"));
				this.invitePanel.setVisible(false);
			}
			else
			{
				this.userHeader.setTitleIcon(this.IMG.HEAD_PATH+"invite.png");
				this.userHeader.setTitleText(this.LANG.INVITE);
				this.invitePanel.setVisible(true);
			}
		},
		
		sendInviteNow: function()
		{
			
		},
		
		backToProfile: function() {
			this.editUserHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
			this.initUser();
			this.userFooter.setItemSelected(1);
		}
	}
});