Osp.Core.Mixin.define("Minus.Main",
{
	members: 
	{
		
		initMain: function() {
			var setActivePage = "mainPage";
			sessionStorage.setItem("activePage", setActivePage);
			this.mainPage = new Osp.Ui.Controls.Form({
				style: Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.FOOTER
			});
			this.mainPage.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.frameObj.addControl(this.mainPage);
			this.frameObj.setCurrentForm(this.mainPage);
			this.createMainHeader();
			this.createMainFooter();
			this.createMainBody();
		},
		
		createMainHeader: function() {
			this.mainHeader = this.mainPage.getHeader();
			this.mainHeader.setTitleText(this.LANG.FOLDERS);
			this.mainHeader.setTitleTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.mainHeader.setTitleIcon(this.IMG.HEAD_PATH+"folder.png");
			this.mainHeader.setColor(this.STYLE.BACKGROUND.HEADER);
			this.mainHeader.setButton('left', {
				actionId: this.ACTIONID.ADDFOLDER,
				icon: {
					normal: this.IMG.HEAD_PATH+"addFolder_button.png",
					pressed: this.IMG.HEAD_PATH+"addFolder_button_pressed.png"
				}
			});
			this.mainHeader.setButtonColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});		
			
			this.mainHeader.setProgressIcon(null);
			this.mainHeader.addListener("actionPerform", this.onHeaderAction, this);
		},
		
		createMainFooter: function() {
			this.mainFooter = this.mainPage.getFooter();
			this.mainFooter.setColor(this.STYLE.BACKGROUND.FOOTER);
			this.mainFooter.setFooterStyle(Osp.Ui.Controls.FooterStyle.TAB);
			this.mainFooter.addItem({
				actionId: this.ACTIONID.HOMEPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"folder.png",
					pressed: this.IMG.FOOT_PATH+"folder_pressed.png"
				}
			});
			this.mainFooter.addItem({
				actionId: this.ACTIONID.USERPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"user.png",
					pressed: this.IMG.FOOT_PATH+"user_pressed.png"
				}
			});
			this.mainFooter.addItem({
				actionId: this.ACTIONID.MSGPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"message.png",
					pressed: this.IMG.FOOT_PATH+"message_pressed.png"
				}
			});
			this.mainFooter.addItem({
				actionId: this.ACTIONID.SETTINGSPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"settings.png",
					pressed: this.IMG.FOOT_PATH+"settings_pressed.png"
				}
			});			
			this.mainFooter.setItemColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED,
				selected: this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.mainFooter.setItemSelected(0);
			this.mainFooter.addListener("actionPerform", this.onFooterAction, this);
		},
		
		createMainBody: function() {
			this.createNewFolderPanel();
			this.newFolderPanel.setVisible(false);
			
			this.folderList = new Osp.Ui.Controls.List({
				bounds: {x: 0, y: 0, width: 480, height: 614},
				itemDivider: true,
				fastScroll: false
			});			
			this.folderList.setVisible(true);
			this.folderList.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.folderList.setItemDividerColor(this.STYLE.ITEM.COLOR.DIVIDER);
			this.folderList.setTextOfEmptyList(this.LANG.NOFOLDERS);
			this.folderList.setTextColorOfEmptyList(this.STYLE.LABEL.COLOR.NORMAL);
			this.folderList.setSweepEnabled(true);
			
			if(localStorage.getItem("fld_complete") != null)
			{
				var folderListObj = JSON.parse(localStorage.getItem("fld_complete"));
				var rspObject = folderListObj.results;
				var folderArray = new Array();
				var folderNameArray = new Array();
				for (var i = 0; i < rspObject.length; i++)
				{
					var gotFolderDetails = rspObject[i];
					var tempItem = this.getFolderItem(gotFolderDetails.name, gotFolderDetails.id, gotFolderDetails.file_count, gotFolderDetails.thumbnail_url, gotFolderDetails.is_public, gotFolderDetails.date_last_updated, gotFolderDetails.view_count);
					this.folderList.addItem(tempItem);
					var newFolderID = gotFolderDetails.id;
					var folderID = Osp.Core.ArrayHelper.insertAt(folderArray, newFolderID, i);
					var newFolderName = gotFolderDetails.name;
					var folderName = Osp.Core.ArrayHelper.insertAt(folderNameArray, newFolderName, i);
				}
				var folderCount = this.folderList.getItemCount();
				localStorage.setItem("folderCount", folderCount);
				localStorage.setItem("folderArray", folderArray);
				localStorage.setItem("folderNameArray", folderNameArray);
				
				this.folderList.addListener("listItemStateChange", this.loadFiles, this);
			}
			
			this.mainPage.addControl(this.folderList);
		},
		
		createNewFolderPanel: function() {
			this.newFolderPanel = new Osp.Ui.Controls.Panel({
				bounds: {x: 0, y: 0, width: 480, height: 614},
				groupStyle: "none"
			});
			this.newFolderPanel.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			
			this.folderNameField = new Osp.Ui.Controls.EditField({
				bounds: {x: 30, y: 20, width: 420,	height:78},
                limitLength: 32,
                editFieldStyle: "text",
                groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
                editFieldTitleStyle: Osp.Ui.Controls.EditFieldTitleStyle.TOP,
                showTitle: true
			});
			this.folderNameField.setTitleText(this.LANG.FOLDERNAME);
			
			this.folderPublicControl = new Osp.Ui.Controls.CheckButton({
				bounds :{x: 30, y: 135, width: 420, height: 72},
				style: "onoff",
				groupStyle: "single",
				backgroundStyle: "default",
                text:this.LANG.PUBLIC
            });
			this.folderPublicControl.setTextColor(this.STYLE.LABEL.COLOR.WHITE);
			this.folderPublicControl.setActionId(this.ACTIONID.PUBLICYES, this.ACTIONID.PUBLICNO, this.ACTIONID.SELECTED);
			this.folderPublicControl.addListener("actionPerform", this.onCheckButtonAction, this);
			
			this.folderContentControl = new Osp.Ui.Controls.CheckButton({
				bounds :{x: 30, y: 225, width: 420, height: 72},
				style: "onoff",
				groupStyle: "single",
				backgroundStyle: "default",
                text:this.LANG.ADDFILES
            });
			this.folderContentControl.setTextColor(this.STYLE.LABEL.COLOR.WHITE);
			this.folderContentControl.setActionId(this.ACTIONID.ADDFILESYES, this.ACTIONID.ADDFILESNO, this.ACTIONID.SELECTED);
			this.folderContentControl.addListener("actionPerform", this.onCheckButtonAction, this);
			
			this.folderAddButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.FOLDERADDING,
				text: this.LANG.CREATEFOLDER,
				bounds: {x: 30,	y: 325,	width: 200, height: 60}
			});
			this.folderCancelButton = new Osp.Ui.Controls.Button({
				actionId: this.ACTIONID.FOLDERCANCEL,
				text: this.LANG.CANCEL,
				bounds: {x: 250, y: 325, width: 200, height: 60}
			});

			this.folderAddButton.addListener("actionPerform", this.onButtonAction, this);
			this.folderCancelButton.addListener("actionPerform", this.onButtonAction, this);
			
			this.mainPage.addControl(this.newFolderPanel);
			this.newFolderPanel.addControl(this.folderNameField);
			this.newFolderPanel.addControl(this.folderPublicControl);
			this.newFolderPanel.addControl(this.folderContentControl);
			this.newFolderPanel.addControl(this.folderAddButton);
			this.newFolderPanel.addControl(this.folderCancelButton);
		},
		
		/*
		 * Files Views
		 */
		initFiles: function() {
			this.filesPage = new Osp.Ui.Controls.Form({
				style: Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.FOOTER
			});
			this.filesPage.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.frameObj.addControl(this.filesPage);
			this.frameObj.setCurrentForm(this.filesPage);
			this.createFilesMainHeader();
			this.createFilesMainFooter();
			this.createFilesMainBody();
		},
		
		createFilesMainHeader: function() {
			this.mainFilesHeader = this.filesPage.getHeader();
			this.mainFilesHeader.setTitleText(localStorage.getItem("folderName"));
			this.mainFilesHeader.setTitleTextColor(this.STYLE.TITLE.COLOR.NORMAL);
			this.mainFilesHeader.setTitleIcon(this.IMG.HEAD_PATH+"folder.png");
			this.mainFilesHeader.setColor(this.STYLE.BACKGROUND.HEADER);
			this.mainFilesHeader.setButton('left', {
				actionId: this.ACTIONID.ADDFILE,
				icon: {
					normal: this.IMG.HEAD_PATH+"addFile_button.png",
					pressed: this.IMG.HEAD_PATH+"addFile_button_pressed.png"
				}
			});
			this.mainFilesHeader.setButtonColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});		
			
			this.mainFilesHeader.setProgressIcon(null);
			this.mainFilesHeader.addListener("actionPerform", this.onHeaderAction, this);
		},
		
		createFilesMainFooter: function() {
			this.mainFilesFooter = this.filesPage.getFooter();
			this.mainFilesFooter.setColor(this.STYLE.BACKGROUND.FOOTER);
			this.mainFilesFooter.setFooterStyle(Osp.Ui.Controls.FooterStyle.TAB);
			this.mainFilesFooter.addItem({
				actionId: this.ACTIONID.HOMEPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"folder.png",
					pressed: this.IMG.FOOT_PATH+"folder_pressed.png"
				}
			});
			this.mainFilesFooter.addItem({
				actionId: this.ACTIONID.USERPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"user.png",
					pressed: this.IMG.FOOT_PATH+"user_pressed.png"
				}
			});
			this.mainFilesFooter.addItem({
				actionId: this.ACTIONID.MSGPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"message.png",
					pressed: this.IMG.FOOT_PATH+"message_pressed.png"
				}
			});
			this.mainFilesFooter.addItem({
				actionId: this.ACTIONID.SETTINGSPAGE,
				icon:
				{
					normal: this.IMG.FOOT_PATH+"settings.png",
					pressed: this.IMG.FOOT_PATH+"settings_pressed.png"
				}
			});			
			this.mainFilesFooter.setItemColor({
				normal : this.STYLE.ITEM.COLOR.NORMAL,
				pressed : this.STYLE.ITEM.COLOR.PRESSED,
				disabled : this.STYLE.ITEM.COLOR.DISABLED,
				highlighted : this.STYLE.ITEM.COLOR.HIGHLIGHTED,
				selected: this.STYLE.ITEM.COLOR.HIGHLIGHTED
			});
			this.mainFilesFooter.setItemSelected(0);
			this.mainFilesFooter.addListener("actionPerform", this.onFooterAction, this);
		},
		
		createFilesMainBody: function() {			
			this.filesList = new Osp.Ui.Controls.List({
				bounds: {x: 0, y: 0, width: 480, height: 614},
				itemDivider: true,
				fastScroll: false
			});
			this.filesList.setBackgroundColor(this.STYLE.BACKGROUND.FORM);
			this.filesList.setItemDividerColor(this.STYLE.ITEM.COLOR.DIVIDER);
			this.filesList.setTextOfEmptyList(this.LANG.NOFILES);
			this.filesList.setTextColorOfEmptyList(this.STYLE.LABEL.COLOR.NORMAL);

			if(localStorage.getItem("files_complete") != null)
			{
				var filesListObj = JSON.parse(localStorage.getItem("files_complete"));
				var rspObjTotal = parseInt(filesListObj.total);
				var rspObject = filesListObj.results;
				var fileArray = new Array();
				for (var i = 0; i < rspObjTotal; i++)
				{
					var gotFilesDetails = rspObject[i];
					var tempItem = this.getFilesItem(gotFilesDetails.name, gotFilesDetails.url_thumbnail_medium, gotFilesDetails.filesize);
					this.filesList.addItem(tempItem);
					var newFile = gotFilesDetails.url_rawfile;
					var file = Osp.Core.ArrayHelper.insertAt(fileArray, newFile, i);
				}
				localStorage.setItem("fileArray", fileArray);
				this.filesList.addListener("listItemStateChange", this.openFile, this);
			}
			this.filesPage.addControl(this.filesList);
		},

		getFolderItem: function(name, id, count, thumbnail, status, lastupdate, views) {
			var item =
			{
					height: 70,
					setting:
					{
						backgroundColor:
						{
							normal: '#FFFFFF',
							pressed: '#EDEDED'
						},
						annex: Osp.Ui.Controls.ListAnnexStyle.NORMAL,
						elements: [],
						contextItem: {
							backgroundColor: "#EDEDED",
							contextItemElements: [
							{
								bounds:{x: 5, y: 5, width: 235, height: 30},
								enable: true,
								image:
								{
									normal:
									{
										src:this.IMG.IMG_PATH+"editFolder.png",
										bounds:{x: 102, y: 0, width: 30, height: 30}
									},
									pressed:
									{
										src:this.IMG.IMG_PATH+"editFolder_pressed.png",
										bounds:{x: 102, y: 0, width: 30, height: 30}
									}
								}
							},
							{
								bounds:{x: 235, y: 5, width: 235, height: 30},
								enable: true,
								image:
								{
									normal:
									{
										src:this.IMG.IMG_PATH+"deleteFolder.png",
										bounds:{x: 102, y: 0, width: 30, height: 30}
								    },
								    pressed:
								    {
								    	src:this.IMG.IMG_PATH+"deleteFolder_pressed.png",
								    	bounds:{x: 102, y: 0, width: 30, height: 30}
								    }
								}
							}]
					    }
					}   
			};
			
			var checkURL = Osp.Core.Check.isUrl(thumbnail);
			if(checkURL == false)
			{
				var wrongString = new RegExp(["//dgbc7tshfzi70.cloudfront.net/smedia/"]);
				var fixedString = "http://dgbc7tshfzi70.cloudfront.net/smedia/";
				var validUrl = Osp.Core.StringHelper.replace(thumbnail, wrongString, fixedString);
				localStorage.setItem("thumbnail", validUrl);
			}
			else
			{
				localStorage.setItem("thumbnail", thumbnail);
			}
			
			if(status == false)
			{
				var isPublic = " *";
			}
			else
			{
				var isPublic = "";
			}
			item.setting.elements.push({
				bounds: {x: 0, y: 0, width: 70, height: 70},
				image:
				{
					normal:
					{
						src: localStorage.getItem("thumbnail"),
						bounds: {x: 5, y: 5, width: 60, height: 60}
					},
					pressed:
					{
						src: localStorage.getItem("thumbnail"),
						bounds: {x: 5, y: 5, width: 60, height: 60}
					}
				}
			});
			
			item.setting.elements.push({
				text: name+" ("+count+")"+isPublic,
				textSize: 30,
				textColor: {
					normal: '#000000',
					pressed: '#000000'
				},
				textSliding: false
			});

			return item;
		},
		
		loadFiles: function(e) {
			if(localStorage.getItem("reloading") == "yes")
			{
				this.mainFilesHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
			}
			else
			{
				this.mainHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
			}
			if(localStorage.getItem("reloading") == "yes")
			{
				var folderId = localStorage.getItem("folderId");
			}
			else
			{
				var listIndex = e.getData().index;
				var folderArrayList = localStorage.getItem("folderArray");
				var folderArray = folderArrayList.split(",");
				var folderId = folderArray[listIndex];
				var folderNameArrayList = localStorage.getItem("folderNameArray");
				var folderNameArray = folderNameArrayList.split(",");
				var folderName = folderNameArray[listIndex];
			}
			var filesLoadAJAX = new Osp.Core.Ajax({
				'url': 'https://minus.com/api/v2/folders/'+folderId+'/files?bearer_token='+localStorage.getItem("AccessToken"),
				'method' : 'GET',
				'success': function(response)
				{
					localStorage.setItem("files_complete", response);
					if(localStorage.getItem("reloading") != "yes")
					{
						localStorage.setItem("folderName", folderName);
						localStorage.setItem("folderId", folderId);
						var reloading = "no";
						localStorage.setItem("reloading", reloading);
					}
				}
			});
			filesLoadAJAX.send();
			
			filesLoadAJAX.addListener("completed", function(response) {
				this.initFiles();
			}, this);
			
			filesLoadAJAX.addListener("failed", function() {
				alert(Osp.App.AppResource.getString("IDS_ERROR_FILESLOADFAILED"));
				this.initMain();
			}, this);
		},
		
		openFile: function(e) {
			this.mainFilesHeader.setProgressIcon(this.IMG.IMG_PATH+"loader.gif");
			var fileIndex = e.getData().index;
			var fileArrayList = localStorage.getItem("fileArray");
			var fileArray = fileArrayList.split(",");
			var file = fileArray[fileIndex];
			
			this.loader(file);
		},
		
		loader: function(url) {
			if(Osp.Core.StringHelper.contains(url, '.jpg') || Osp.Core.StringHelper.contains(url, '.jpeg') || Osp.Core.StringHelper.contains(url, '.bmp') || Osp.Core.StringHelper.contains(url, '.gif') || Osp.Core.StringHelper.contains(url, '.png') || Osp.Core.StringHelper.contains(url, '.wbmp'))
			{
				this.startBrowser(url);
			}
			else
			{
				if(Osp.Core.StringHelper.contains(url, '.3gp') || Osp.Core.StringHelper.contains(url, '.mp4') || Osp.Core.StringHelper.contains(url, '.avi') || Osp.Core.StringHelper.contains(url, '.divx') || Osp.Core.StringHelper.contains(url, '.mkv') || Osp.Core.StringHelper.contains(url, '.wmv') || Osp.Core.StringHelper.contains(url, '.asf'))
				{
					this.startBrowser(url);
				}
				else
				{
					if(Osp.Core.StringHelper.contains(url, '.mp3') || Osp.Core.StringHelper.contains(url, '.aac') || Osp.Core.StringHelper.contains(url, '.3ga') || Osp.Core.StringHelper.contains(url, '.m4a') || Osp.Core.StringHelper.contains(url, '.wma') || Osp.Core.StringHelper.contains(url, '.flac') || Osp.Core.StringHelper.contains(url, '.ogg'))
					{
						this.startBrowser(url);
					}
					else
					{
						if(Osp.Core.StringHelper.contains(url, '.wav') || Osp.Core.StringHelper.contains(url, '.mmf') || Osp.Core.StringHelper.contains(url, '.xmf') || Osp.Core.StringHelper.contains(url, '.imy') || Osp.Core.StringHelper.contains(url, '.midi') || Osp.Core.StringHelper.contains(url, '.amr'))
						{
							this.startBrowser(url);
						}
						else
						{
							if(Osp.Core.StringHelper.contains(url, '.vcs') || Osp.Core.StringHelper.contains(url, '.ics') || Osp.Core.StringHelper.contains(url, '.vnt') || Osp.Core.StringHelper.contains(url, '.doc') || Osp.Core.StringHelper.contains(url, '.docx') || Osp.Core.StringHelper.contains(url, '.pdf') || Osp.Core.StringHelper.contains(url, '.ppt') || Osp.Core.StringHelper.contains(url, '.pptx') || Osp.Core.StringHelper.contains(url, '.txt') || Osp.Core.StringHelper.contains(url, '.xls') || Osp.Core.StringHelper.contains(url, '.xlsx'))
							{
								this.startBrowser(url);
							}
							else
							{
								this.mainFilesHeader.setProgressIcon(null);
								alert(this.LANG.ERROR.FORMAT);
							}
						}
					}
				}
			}
		},
		
		startBrowser: function(file) {
			try
			{
				var appControlObject = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.browser", "osp.appcontrol.operation.view");
				if (appControlObject !== undefined && appControlObject !== null) 
				{
					var datalist = [];
					datalist[0] = "url:"+file;
					appControlObject.start(datalist, null);	
				}
				this.mainFilesHeader.setProgressIcon(null);
			}
			catch(e)
			{
				alert("Exception");
			}
		},
		
		createFolderNow: function() {
			var folderName = this.folderNameField.getText();
			var publicState = localStorage.getItem("publicMode");
			var uploadFiles = localStorage.getItem("addFilesMode");
			if(publicState == "yes")
			{
				var isPublic = "true";
			}
			else
			{
				var isPublic = "false";
			}
			var folderCreater = new Osp.Core.Ajax({
				'url': 'https://minus.com/api/v2/users/'+localStorage.getItem("slug")+'/folders?bearer_token='+localStorage.getItem("AccessToken"),
				'method' : 'POST',
				'requestHeaders' :
				{
					"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
					"Accept-Charset": "UTF-8,*;q=0.5"
				},
				'parameters':
				{
					"name": folderName,
					"is_public": isPublic
				},
				'success' : function(responseContent)
				{
					var folderId = JSON.parse(responseContent).id;
					localStorage.setItem("folderId", folderId);
				}
			});
			folderCreater.send();
			
			folderCreater.addListener("completed", function()
			{
				if(uploadFiles == "yes")
				{
					this.initUpload();
				}
				else
				{
					this.getFolders();
				}
			}, this);
			
			folderCreater.addListener("failed", function()
			{
				alert(Osp.App.AppResource.getString("IDS_ERROR_CANTCREATEFOLDER"));
				this.initMain();
			}, this);
		},
		
		getFilesItem: function(name, thumbnail, filesize)
		{
			var size = bytesToSize(parseInt(filesize), 1);
			var itemFile =
			{
					height: 70,
					setting:
					{
						backgroundColor:
						{
							normal: '#FFFFFF',
							pressed: '#EDEDED'
						},
						annex: Osp.Ui.Controls.ListAnnexStyle.NORMAL,
						elements: []
					}   
			};
			
			itemFile.setting.elements.push({
				bounds: {x: 0, y: 0, width: 70, height: 70},
				image:
				{
					normal:
					{
						src: thumbnail,
						bounds: {x: 5, y: 5, width: 60, height: 60}
					},
					pressed:
					{
						src: thumbnail,
						bounds: {x: 5, y: 5, width: 60, height: 60}
					}
				}
			});
			
			itemFile.setting.elements.push({
				text: name+" ("+size+")",
				textSize: 30,
				textColor: {
					normal: '#000000',
					pressed: '#000000'
				},
				textSliding: true
			});

			return itemFile;
		},
		
		initUpload: function()
		{
			try
			{
				appcontrolCompletedCallback = function(callback,appControlId, operationId, resultList) 
				{
					if(callback == "onAppControlCompleted")
					{
						var appControlStatus = resultList[0];
						if(appControlStatus === "Succeeded")
						{
							for(i=1; i < resultList.length; i++)
							{
								var selectedFile = resultList[i];
								var lastSlash = Osp.Core.StringHelper.lastIndexOf(selectedFile,"/",0);
								var filename = Osp.Core.StringHelper.substr(selectedFile,lastSlash+1,100);
								var removable = "/Storagecard/Media/";
								var images = "/Media/Images/";
								var videos = "/Media/Videos/";
								var sounds = "/Media/Sounds/";
								var documents = "/Media/Others/";
								localStorage.setItem("selectedFile", filename);
								if(Osp.Core.StringHelper.startsWith(selectedFile, images))
								{
									if(lastSlash+1 == images.length)
									{
										var dirname = "images";
									}
									else
									{
										x = Osp.Core.StringHelper.lastIndexOf(selectedFile,"/",images.length);
										var dirname = "images/"+Osp.Core.StringHelper.toLowerCase(Osp.Core.StringHelper.substr(selectedFile,images.length,x));
									} 
								 }
								 else if(Osp.Core.StringHelper.startsWith(selectedFile, videos))
								 {
									if(lastSlash+1 == videos.length)
									{
										var dirname = "videos";
									}
									else
									{
										x = Osp.Core.StringHelper.lastIndexOf(selectedFile,"/",videos.length);
										var dirname = "videos/"+Osp.Core.StringHelper.toLowerCase(Osp.Core.StringHelper.substr(selectedFile,videos.length,x));
									}
								 }
								 else if(Osp.Core.StringHelper.startsWith(selectedFile, sounds))
								 {
									if(lastSlash+1 == sounds.length)
									{
										var dirname = "music";
									}
									else
									{
										x = Osp.Core.StringHelper.lastIndexOf(selectedFile,"/",videos.length);
										var dirname = "music/"+Osp.Core.StringHelper.toLowerCase(Osp.Core.StringHelper.substr(selectedFile,sounds.length,x));
									}
								 }
								 else if(Osp.Core.StringHelper.startsWith(selectedFile, documents))
								 {
									if(lastSlash+1 == documents.length)
									{
										var dirname = "documents";
									}
									else
									{
										x = Osp.Core.StringHelper.lastIndexOf(selectedFile,"/",documents.length);
										var dirname = "documents/"+Osp.Core.StringHelper.toLowerCase(Osp.Core.StringHelper.substr(selectedFile,documents.length,x));
									}	 
								 }
								 else if(Osp.Core.StringHelper.startsWith(selectedFile, removable))
								 {
									if(lastSlash+1 == removable.length)
									{
										var dirname = "removable";
									}
									else
									{
										x = Osp.Core.StringHelper.lastIndexOf(selectedFile,"/",removable.length);
										var dirname = "removable/"+Osp.Core.StringHelper.toLowerCase(Osp.Core.StringHelper.substr(selectedFile,removable.length,x)); 
									} 
								 }
								 else
								 {
									var dirname = null;
								 }
								 
								 function successCB(files)
								 {
								 	 for(i=0;i < files.length; i++)
								 	 {
								 		 if(files[i].isDirectory)
								 		 {
								 			 continue;
								 		 }
								 		 if(files[i].name == localStorage.getItem("selectedFile"))
								 		 {
							 				var file;
							 				deviceapis.filesystem.resolve(function(dir) {
							 					file = dir.resolve(filename);
							 					var filesize = file.fileSize;
								 				var filename = file.name;
								 				var filepath = file.path;
								 				var caption = Osp.Core.StringHelper.substr(file.name, 0, Osp.Core.StringHelper.lastIndexOf(files[i].name,".",0));
							 					file.openStream(function(stream) {
							 						var raw = stream.readBytes(filesize);
							 						var uploadArray = new Array();
							 						for(var i = 0; i < raw.length; i++)
							 						{
							 							uploadArray.push(raw[i]);
							 						}
							 						/*
							 						var accesstoken = localStorage.getItem("AccessToken");
								 					var folderId = localStorage.getItem("folderId");
								 					var boundary = "----WebKitFormBoundary"+random();
								 					var CLRF = "\r\n";
										 						
								 					var body = '--' + boundary + CLRF
								 					+ 'Content-Disposition: form-data; name="file"; filename="'+filename+'"' + CLRF
								 					+ 'Content-Type: application/octet-stream'
								 					+ CLRF + CLRF
								 					+ uploadfile + CLRF
								 					+ '--' + boundary + CLRF
								 					+ 'Content-Disposition: form-data; name="filename"'
								 					+ CLRF + CLRF
								 					+ filename + CLRF
								 					+ '--' + boundary + CLRF
								 					+ 'Content-Disposition: form-data; name="caption"'
								 					+ CLRF + CLRF
								 					+ caption + CLRF
								 					+ '--' + boundary + '--';

								 					var uploadAJAX = new Osp.Core.Ajax({
								 						'url': 'http://minus.com/api/v2/folders/'+folderId+'/files?bearer_token='+accesstoken,
								 						'method' : 'POST',
								 						'data': body.toString(),
								 						'requestHeaders' :
								 						{
								 							"Content-Type": "multipart/form-data; boundary="+boundary,
								 							//"Content-Length": fileSize,
								 							"Accept-Charset": "UTF-8,*;q=0.5"
								 						}
								 					});
										 			
								 					uploadAJAX.send(null);
										 			
								 					uploadAJAX.addListener("completed", function(response) {
								 						var complete = new Minus(frameObj);
								 						complete.getFolders();
								 					}, this);

						 							uploadAJAX.addListener("failed", function() {
						 								alert("Upload Failed");
						 							}, this);
									 								
						 							uploadAJAX.addListener("aborted", function(response) {
						 								var aborted = new Minus(frameObj);
						 								aborted.getFolders();
						 							}, this);

						 							uploadAJAX.addListener("timeout", function() {
						 								alert("Timeout");
						 								var timeout = new Minus(frameObj);
						 								timeout.getFolders();
						 							}, this);
						 							*/
							 					}, function(e) {
							 						alert("Steam error" + e.message);
							 					}, "r", "UTF-8");
							 				}, function(e) {
							 					alert("Error" + e.message);
							 			}, filepath, "rw");
								 	}
								 }
							}
								 
								 
								 
								 
								 
								 
								 
								 /*
								  * error of listing list files
								  */
								 function errorCB(error)
								 {
									 console.log("The error " + error.message + " occurred when listing the files in the selected folder");
								 }
								 
								 var documentsDir;								 
								 deviceapis.filesystem.resolve(function(dir) {documentsDir = dir; dir.listFiles(successCB, errorCB);}, function(e) {console.log("Error" + e.message);}, dirname, "r");
							 }
						 }
					 }
				};
				var appControlObjectMedia = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.media", "osp.appcontrol.operation.pick");
				if (appControlObjectMedia !== undefined && appControlObjectMedia !== null) 
				{
					var datalistMedia = [];
					datalistMedia[0] = "type:all";
					datalistMedia[1] = "selectionType:multiple";
					appControlObjectMedia.start(datalistMedia,appcontrolCompletedCallback);	
				}
			}
			catch(e)
			{
				alert("Exception");
			}
		}
	}
});