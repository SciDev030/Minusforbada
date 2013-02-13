Osp.Core.Mixin.define("Minus.Message",
{
	members: 
	{
		initMessage: function() {
			this.messagePage = new Osp.Ui.Controls.Form({
				style: Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.FOOTER
			});
			this.messagePage.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.frameObj.addControl(this.messagePage);
			this.frameObj.setCurrentForm(this.messagePage);
			this.createMessageHeader();
			if(sessionStorage.getItem("activePage") == "messagesFromUser")
			{
				this.createMessageFromUserBody();
			}
			else if(sessionStorage.getItem("activePage") == "messagesThread")
			{
				this.createMessageThread();
			}
			else
			{
				this.createMessageBody();
			}
			this.createMessageFooter();
		},
		
		createMessageHeader: function() {
			this.messageHeader = this.messagePage.getHeader();
			this.messageHeader.setTitleText(this.LANG.MESSAGES);
			this.messageHeader.setTitleTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.messageHeader.setTitleIcon(this.IMG.HEAD_PATH+"message.png");
			this.messageHeader.setColor(this.STYLE.BACKGROUND.HEADER);
			this.messageHeader.setButton('right', {
				actionId: this.ACTIONID.NEWMSG,
				icon: {
					normal: this.IMG.HEAD_PATH+"msg_button.png",
					pressed: this.IMG.HEAD_PATH+"msg_button_pressed.png"
				}
			});
			this.messageHeader.setButtonColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			if(sessionStorage.getItem("activePage") == "messagesAll")
			{
				this.messageHeader.setButton('left', {
					actionId: this.ACTIONID.OPENSEARCH,
					icon: {
						normal: this.IMG.HEAD_PATH+"search_button.png",
						pressed: this.IMG.HEAD_PATH+"search_button_pressed.png"
					}
				});
			}
			else
			{
				this.messageHeader.setButton('left', {
					actionId: this.ACTIONID.BACKMESSAGES,
					icon: {
						normal: this.IMG.HEAD_PATH+"back_button.png",
						pressed: this.IMG.HEAD_PATH+"back_button_pressed.png"
					}
				});
			}
			this.messageHeader.setButtonColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.messageHeader.setProgressIcon(null);
			this.messageHeader.addListener("actionPerform", this.onHeaderAction, this);
		},
		
		createMessageFooter: function() {
			this.messageFooter = this.messagePage.getFooter();
			this.messageFooter.setColor(this.STYLE.BACKGROUND.FOOTER);
			this.messageFooter.setFooterStyle(Osp.Ui.Controls.FooterStyle.TAB);
			this.messageFooter.addItem({
				actionId: this.ACTIONID.HOMEPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"folder.png",
					pressed: this.IMG.FOOT_PATH+"folder_pressed.png"
				}
			});
			this.messageFooter.addItem({
				actionId: this.ACTIONID.USERPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"user.png",
					pressed: this.IMG.FOOT_PATH+"user_pressed.png"
				}
			});
			this.messageFooter.addItem({
				actionId: this.ACTIONID.MSGPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"message.png",
					pressed: this.IMG.FOOT_PATH+"message_pressed.png"
				}
			});
			this.messageFooter.addItem({
				actionId: this.ACTIONID.SETTINGSPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"settings.png",
					pressed: this.IMG.FOOT_PATH+"settings_pressed.png"
				}
			});			
			this.messageFooter.setItemColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED,
				selected: this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.messageFooter.setItemSelected(2);
			this.messageFooter.addListener("actionPerform", this.onFooterAction, this);
		},
		
		createMessageBody: function() {
			this.createSearchBar();
			this.createStatusBar();
			
			/*
			 * Message List
			 */
			this.messageList = new Osp.Ui.Controls.List({
				bounds: {x: 0, y: 98, width: 480, height: 516},
				itemDivider: true,
				fastScroll: false
			});
			this.messageList.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.messageList.setTextColorOfEmptyList(this.STYLE.LABEL.COLOR.NORMAL);
			this.messageList.setItemDividerColor(this.STYLE.ITEM.COLOR.DIVIDER);
			this.messageList.setTextOfEmptyList(this.LANG.NOMESSAGES);

			var messageListObject = JSON.parse(localStorage.getItem("msg_complete"));
			var rspObject = messageListObject.results;
			var threadArray = new Array();
			for (var i = 0; i < rspObject.length; i++)
			{
				var gotMessageDetails = rspObject[i];
				
				var tempItem = this.getItem(gotMessageDetails.sender, gotMessageDetails.target, gotMessageDetails.body, gotMessageDetails.read);
				this.messageList.addItem(tempItem);
				var newThread = gotMessageDetails.name;
				var thread = Osp.Core.ArrayHelper.insertAt(threadArray, newThread, i);
			}
			this.messagePage.addControl(this.messageList);
			//this.messageList.addListener("listItemStateChange", this.openThread, this);
		},
		
		createMessageFromUserBody: function() {
			this.createStatusBar();
			
			/*
			 * Message List
			 */
			this.messageFromUserList = new Osp.Ui.Controls.List({
				bounds: {x: 0, y: 98, width: 480, height: 516},
				itemDivider: true,
				fastScroll: false
			});
			this.messageFromUserList.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.messageFromUserList.setTextColorOfEmptyList(this.STYLE.LABEL.COLOR.NORMAL);
			this.messageFromUserList.setTextOfEmptyList(this.LANG.EMPTY);
			this.messageFromUserList.setSweepEnabled(true);

			var messageFromUserListObject = JSON.parse(localStorage.getItem("msgsFromUser_complete"));
			var rspFromUserObject = messageFromUserListObject.results;
			for (var i = 0; i < rspFromUserObject.length; i++)
			{
				var gotMessageDetails = rspFromUserObject[i];
				
				var tempItem = this.getItem(gotMessageDetails.sender, gotMessageDetails.target, gotMessageDetails.body, gotMessageDetails.read);
				this.messageFromUserList.addItem(tempItem);
			}
			this.messagePage.addControl(this.messageFromUserList);
		},
		
		createMessageThread: function() {
			this.createStatusBar();
			
			/*
			 * Message List
			 */
			this.messageThreadList = new Osp.Ui.Controls.List({
				bounds: {x: 0, y: 98, width: 480, height: 516},
				itemDivider: true,
				fastScroll: false
			});
			this.messageThreadList.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.messageThreadList.setTextColorOfEmptyList(this.STYLE.LABEL.COLOR.NORMAL);
			this.messageThreadList.setTextOfEmptyList(this.LANG.EMPTY);
			this.messageThreadList.setSweepEnabled(true);

			var messageThreadListObject = JSON.parse(localStorage.getItem("msgsFromUser_complete"));
			var rspThreadObject = messageThreadListObject.results;
			
			for (var i = 0; i < rspThreadObject.length; i++)
			{
				var gotMessageDetails = rspThreadObject[i];
				var tempItem = this.getThreadItem(gotMessageDetails.sender, gotMessageDetails.target, gotMessageDetails.body, gotMessageDetails.read);
				
				this.messageFromUserList.addItem(tempItem);
			}
			this.messagePage.addControl(this.messageFromUserList);
		},
		
		getItem: function(sender, target, message, status)
		{
			var senderClean = Osp.Core.StringHelper.substr(sender,31,48);
			var targetClean = Osp.Core.StringHelper.substr(target,31,48);
			if(senderClean == localStorage.getItem("slug"))
			{
				var item =
				{
					height: 60,
					setting:
					{
						backgroundColor:
						{
							normal: '#FDFDFD',
							pressed: '#EDEDED'
						},
						descriptionText: "test",
						descriptionTextColor : "FFA500",
						annex: Osp.Ui.Controls.ListAnnexStyle.NORMAL,
						elements: []
					}   
				};
			}
			else
			{
				var item =
				{
					height: 60,
					setting:
					{
						backgroundColor:
						{
							normal: '#FFFFFF',
							pressed: '#EDEDED'
						},
						descriptionText: "test",
						descriptionTextColor : "FFA500",
						annex: Osp.Ui.Controls.ListAnnexStyle.NORMAL,
						elements: []
					}   
				};
			}
			
			if(status == true) {
				item.setting.elements.push({
					bounds: {x: 0, y: 0, width: 70, height: 60},
					image:
					{
						normal:
						{
							src: this.IMG.IMG_PATH + "msg_read.png",
							bounds: {x: 0, y: 5, width: 50, height: 50}
						},
						pressed:
						{
							src: this.IMG.IMG_PATH + "msg_read.png",
							bounds: {x: 0, y: 0, width: 60, height: 60}
						}
					}
				});
			}
			else {
				item.setting.elements.push({
					bounds: {x: 0, y: 0, width: 70, height: 60},
					image:
					{
						normal:
						{
							src: this.IMG.IMG_PATH + "msg_unread.png",
							bounds: {x: 0, y: 5, width: 50, height: 50}
						},
						pressed:
						{
							src: this.IMG.IMG_PATH + "msg_unread.png",
							bounds: {x: 0, y: 0, width: 60, height: 60}
						}
					}
				});
			}

			if(targetClean == localStorage.getItem("slug"))
			{
				item.setting.elements.push({
					text: senderClean+": "+message,
					textSize: 30,
					textColor: {
						normal: '#000000',
						pressed: '#000000'
					},
					textSliding: true
				});
				return item;
			}
			else
			{
				item.setting.elements.push({
					text: targetClean+": "+message,
					textSize: 30,
					textColor: {
						normal: '#000000',
						pressed: '#000000'
					},
					textSliding: true
				});
				return item;
			}
		},
		
		createStatusBar: function() {
			if(sessionStorage.getItem("activePage") == "messagesAll")
			{
				var totalMessagesCount = localStorage.getItem("msg_total");
			}
			else
			{
				var totalMessagesCount = localStorage.getItem("msgsFromUser_total");
			}
			this.statusBar = new Osp.Ui.Controls.Panel({
				bounds: {x: 0, y: 0, width: 480, height: 40},
				groupStyle: "middle"
			});
			this.statusBar.setBackgroundColor('#EDEDED');
			this.statusBar.setVisible(true);
			
			this.totalMessages = new Osp.Ui.Controls.Label({
				 bounds: {x: 30, y: 5, width: 420, height: 30},
				text: this.LANG.TOTAL+": "+totalMessagesCount,
				multiLine: false
			});
			this.totalMessages.setTextColor(this.STYLE.LABEL.COLOR.NORMAL);
			this.totalMessages.setTextHorizontalAlignment('center');
			this.totalMessages.setTextSize(this.STYLE.LABEL.SIZE.NORMAL);
			/*
			 * Message Parents/Child
			 */
			// add statusBar, messageList to messagePage
			this.messagePage.addControl(this.statusBar);
			// add totalMessages to statusBar
			this.statusBar.addControl(this.totalMessages);
		},
	
		createSearchBar: function() {
			this.searchPanel = new Osp.Ui.Controls.Panel({
				bounds: {x: 0, y: 0, width: 480, height: 98},
				groupStyle: "middle"
			});
			this.searchPanel.setBackgroundColor('#EDEDED');
			this.searchPanel.setVisible(false);
			
			this.searchField = new Osp.Ui.Controls.EditField({
				bounds: {x: 10, y: 10, width: 270, height: 78},
				limitLength: 48,
				editFieldStyle: "normal",
				groupStyle: "single",
				editFieldTitleStyle: "top",
				enableClear: true,
				showTitle: false
			});
			this.searchField.setGuideText(this.LANG.USERNAME);
			
			this.searchButton = new Osp.Ui.Controls.Button({
				bounds: {x: 330, y: 24, width: 50, height: 50},
				actionId: this.ACTIONID.MSGUSERSEARCH,
				text: ""
			});
			this.searchButton.setBackgroundImage({
				normal: this.IMG.IMG_PATH+"search.png",
				pressed: this.IMG.IMG_PATH+"search_pressed.png"
			});
			
			this.clearButton = new Osp.Ui.Controls.Button({
				bounds: {x: 400, y: 24, width: 50, height: 50},
				actionId: this.ACTIONID.MSGUSERSEARCHCLEAR,
				text: ""
			});
			this.clearButton.setBackgroundImage({
				normal: this.IMG.IMG_PATH+"clear.png",
				pressed: this.IMG.IMG_PATH+"clear_pressed.png"
			});
			
			this.searchButton.addListener("actionPerform", this.onButtonAction, this);
			this.clearButton.addListener("actionPerform", this.onButtonAction, this);
			
			this.messagePage.addControl(this.searchPanel);
			this.searchPanel.addControl(this.searchField);
			this.searchPanel.addControl(this.searchButton);
			this.searchPanel.addControl(this.clearButton);
		},
		
		getMessages: function() {
			var messageLoaderAJAX = new Osp.Core.Ajax({
				'url': 'https://minus.com/api/v2/activeuser/messages?bearer_token='+localStorage.getItem("AccessToken"),
				'method' : 'GET',
				'success' : function(response)
				{
					var setActivePage = "messagesAll";
					sessionStorage.setItem("activePage", setActivePage);
					var MSGObj = JSON.parse(response);
					localStorage.setItem("msg_complete", response);
					localStorage.setItem("msg_page", MSGObj.page);
					localStorage.setItem("msg_next", MSGObj.next);
					localStorage.setItem("msg_perpage", MSGObj.perpage);
					localStorage.setItem("msg_total", MSGObj.total);
					localStorage.setItem("msg_pages", MSGObj.pages);
					localStorage.setItem("msg_previous", MSGObj.previous);
					createMessageUI = new Minus(frameObj);
					createMessageUI.initMessage();
				},
				'failed' : function(){
					alert(Osp.App.AppResource.getString("IDS_ERROR_MESSAGELOADFAILED"));
					createMessageUI = new Minus(frameObj);
					createMessageUI.initMessage();
				}
			});
			messageLoaderAJAX.send();
		},
		
		getThread: function() {
			var listIndex = e.getData().index;
			var threadArrayList = localStorage.getItem("threadArray");
			var threadArray = threadArrayList.split(",");
			var thread = threadArray[listIndex];
			var messageThreadLoaderAJAX = new Osp.Core.Ajax({
				'url': thread+'?bearer_token='+localStorage.getItem("AccessToken"),
				'method' : 'GET',
				'success' : function(response)
				{
					var setActivePage = "messageThread";
					sessionStorage.setItem("activePage", setActivePage);
					var MSGObj = JSON.parse(response);
					localStorage.setItem("thd_complete", response);
					localStorage.setItem("thd_page", MSGObj.page);
					localStorage.setItem("thd_next", MSGObj.next);
					localStorage.setItem("thd_perpage", MSGObj.perpage);
					localStorage.setItem("thd_total", MSGObj.total);
					localStorage.setItem("thd_pages", MSGObj.pages);
					localStorage.setItem("thd_previous", MSGObj.previous);
					createMessageUI = new Minus(frameObj);
					createMessageUI.initMessage();
				},
				'failed' : function(){
					alert(Osp.App.AppResource.getString("IDS_ERROR_THREADLOADFAILED"));
					createMessageUI = new Minus(frameObj);
					createMessageUI.initMessage();
				}
			});
			messageThreadLoaderAJAX.send();
		},
		/*
		 * load all message between activeuser and searchForUser
		 */
		getMessagesFromUser: function() {
			var searchForUser = this.searchField.getText();
			var messageFromUserLoaderAJAX = new Osp.Core.Ajax({
				'url': 'https://minus.com/api/v2/activeuser/messages/'+searchForUser+'?bearer_token='+localStorage.getItem("AccessToken"),
				'method' : 'GET',
				'success' : function(response)
				{
					var setActivePage = "messagesFromUser";
					sessionStorage.setItem("activePage", setActivePage);
					var msgsFromUserObj = JSON.parse(response);	
					localStorage.setItem("msgsFromUser_complete", response);
					localStorage.setItem("msgsFromUser_page", msgsFromUserObj.page);
					localStorage.setItem("msgsFromUser_next", msgsFromUserObj.next);
					localStorage.setItem("msgsFromUser_perpage", msgsFromUserObj.perpage);
					localStorage.setItem("msgsFromUser_total", msgsFromUserObj.total);
					localStorage.setItem("msgsFromUser_pages", msgsFromUserObj.pages);
					localStorage.setItem("msgsFromUser_previous", msgsFromUserObj.previous);
					createMessageUI = new Minus(frameObj);
					createMessageUI.initMessage();
				},
				'failed' : function(){
					alert(Osp.App.AppResource.getString("IDS_ERROR_SEARCHFAILED"));
					createMessageUI = new Minus(frameObj);
					createMessageUI.initMessage();
				}
			});
			messageFromUserLoaderAJAX.send();
		},
		/*
		 * response direct to targetUser from messagelist
		 */
		responseUserNow: function() {
			this.newMessageHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
			var targetUser = this.userTargetField.getText();
			var messageBody = this.userBodyField.getText();
			var messageSenderAJAX = new Osp.Core.Ajax({
				'url': 'https://minus.com/api/v2/activeuser/messages/'+targetUser+'?bearer_token='+localStorage.getItem("AccessToken"),
				'method' : 'POST',
				'parameters': {
					body: messageBody
				},
				'success' : function(response)
				{
					alert(Osp.App.AppResource.getString("IDS_SENDSUCCESSFUL"));
					messageObjSuccess = new Minus(frameObj);
					messageObjSuccess.backToMessages();
				},
				'failed' : function(){
					alert(Osp.App.AppResource.getString("IDS_SENDUNSUCCESSFUL"));
					messageObjFailed = new Minus(frameObj);
					messageObjFailed.createNewMessage();
				}
			});
			messageSenderAJAX.send();
		},
		
		/*
		 * Create Page [New Message]
		 */
		createNewMessage: function() {
			this.newMessageForm = new Osp.Ui.Controls.Form({
				style: Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.FOOTER
			});
			this.newMessageForm.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.frameObj.addControl(this.newMessageForm);
			this.frameObj.setCurrentForm(this.newMessageForm);
			this.createNewMessageHeader();
			this.createNewMesssageFooter();
			this.createNewMessageBody();
		},
		
		createNewMessageHeader: function() {
			this.newMessageHeader = this.newMessageForm.getHeader();
			this.newMessageHeader.setTitleText(this.LANG.NEWMESSAGE);
			this.newMessageHeader.setTitleTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.newMessageHeader.setTitleIcon(this.IMG.HEAD_PATH+"msg.png");
			this.newMessageHeader.setColor(this.STYLE.BACKGROUND.HEADER);
			this.newMessageHeader.setProgressIcon(null);
		},
		
		createNewMesssageFooter: function() {
			this.newMessageFooter = this.newMessageForm.getFooter();
			this.newMessageFooter.setColor(this.STYLE.BACKGROUND.FOOTER);
			this.newMessageFooter.setBackButton();
			this.newMessageFooter.setButtonColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.newMessageFooter.addListener("formBackRequest", this.backToMessages, this);
		},
		
		createNewMessageBody: function() {
			this.userTargetField = new Osp.Ui.Controls.EditField({
				bounds: {x: 30, y: 10, width: 420, height: 78},
				limitLength: 48,
				editFieldStyle: "normal",
				groupStyle: "single",
				editFieldTitleStyle: "top",
				showTitle: true
			});
			this.userTargetField.setTitleText(this.LANG.TO);
			
			this.userBodyField = new Osp.Ui.Controls.EditArea({
				bounds: {x: 30, y: 120, width: 420, height: 400},
				limitLength: 2048
			});
			
			if(localStorage.getItem("Signature") == null)
			{
				var defaultSignature = "via Minus for bada";
				this.userBodyField.appendText("\n\n\n"+defaultSignature);
			}
			else
			{
				this.userBodyField.appendText("\n\n\n"+localStorage.getItem("Signature"));
			}

			this.sendButton = new Osp.Ui.Controls.Button({
				bounds: {x: 30, y: 535,	width: 200, height: 60},
				actionId: this.ACTIONID.SEND,
				text: this.LANG.SEND
			});
			
			this.abortButton = new Osp.Ui.Controls.Button({
				bounds: {x: 250, y: 535, width: 200, height: 60},
				actionId: this.ACTIONID.ABORT,
				text: this.LANG.CANCEL
			});
			
			this.sendButton.addListener("actionPerform", this.onButtonAction, this);
			this.abortButton.addListener("actionPerform", this.onButtonAction, this);
			
			this.newMessageForm.addControl(this.userTargetField);
			this.newMessageForm.addControl(this.userBodyField);
			this.newMessageForm.addControl(this.sendButton);
			this.newMessageForm.addControl(this.abortButton);
		},
		
		/*
		 * Send message to targetUser
		 */
		sendNow: function() {
			var targetUser = this.userTargetField.getText();
			var messageBody = this.userBodyField.getText();
			var messageSenderAJAX = new Osp.Core.Ajax({
				'url': 'https://minus.com/api/v2/activeuser/messages/'+targetUser+'?bearer_token='+localStorage.getItem("AccessToken"),
				'method' : 'POST',
				'parameters': {
					body: messageBody
				},
				'success' : function(response)
				{
					alert(Osp.App.AppResource.getString("IDS_SENDSUCCESSFUL"));
					messageObjSuccess = new Minus(frameObj);
					messageObjSuccess.getMessages();
				},
				'failed' : function(){
					alert(Osp.App.AppResource.getString("IDS_SENDUNSUCCESSFUL"));
					messageObjFailed = new Minus(frameObj);
					messageObjFailed.createNewMessage();
				}
			});
			messageSenderAJAX.send();
		},
		
		/*
		 * go back to messages
		 */
		backToMessages: function() {
			this.initMessage();
			this.messageFooter.setItemSelected(2);
		}
	}
});