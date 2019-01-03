sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./utilities",
		"sap/ui/core/routing/History",
		'sap/ui/model/json/JSONModel'
	], function (BaseController, MessageBox, Utilities, History, JSONModel) {
		"use strict";
		return BaseController.extend("com.sap.build.standard.translation.controller.Page", {
			handleRouteMatched: function (oEvent) {
				var sAppId = "App5bd73f25160adf75257e0101";
				var oParams = {};
				if (oEvent.mParameters.data.context) {
					this.sContext = oEvent.mParameters.data.context;
				} else {
					if (this.getOwnerComponent().getComponentData()) {
						var patternConvert = function (oParam) {
							if (Object.keys(oParam).length !== 0) {
								for (var prop in oParam) {
									if (prop !== "sourcePrototype") {
										return prop + "(" + oParam[prop][0] + ")";
									}
								}
							}
						};
						this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);
					}
				}
				var oPath;
				if (this.sContext) {
					oPath = {
						path: "/" + this.sContext,
						parameters: oParams
					};
					this.getView().bindObject(oPath);
				}
			},

			defineData: function () {
				return {
					"languagesCollection": [{
						"key": "ar",
						"text": "Arabic"
					}, {
						"key": "bg",
						"text": "Bulgarian"
					}, {
						"key": "ca",
						"text": "Catalan"
					}, {
						"key": "zh",
						"text": "Chinese (Simplified)"
					}, {
						"key": "zf",
						"text": "Chinese (Traditional)"
					}, {
						"key": "hr",
						"text": "Croatian"
					}, {
						"key": "cs",
						"text": "Czech"
					}, {
						"key": "da",
						"text": "Danish"
					}, {
						"key": "nl",
						"text": "Dutch"
					}, {
						"key": "6n",
						"text": "English (Great Britain)"
					}, {
						"key": "en",
						"text": "English (United States)"
					}, {
						"key": "et",
						"text": "Estonian"
					}, {
						"key": "fi",
						"text": "Finnish"
					}, {
						"key": "fr",
						"text": "French (France)"
					}, {
						"key": "3f",
						"text": "French (Canada)"
					}, {
						"key": "de",
						"text": "German"
					}, {
						"key": "el",
						"text": "Greek"
					}, {
						"key": "he",
						"text": "Hebrew"
					}, {
						"key": "hi",
						"text": "Hindi"
					}, {
						"key": "hu",
						"text": "Hungarian"
					}, {
						"key": "it",
						"text": "Italian"
					}, {
						"key": "ja",
						"text": "Japanese"
					}, {
						"key": "ko",
						"text": "Korean"
					}, {
						"key": "lv",
						"text": "Latvian"
					}, {
						"key": "lt",
						"text": "Lithuanian"
					}, {
						"key": "ms",
						"text": "Malay"
					}, {
						"key": "no",
						"text": "Norwegian"
					}, {
						"key": "fa",
						"text": "Persian - pilot language"
					}, {
						"key": "pl",
						"text": "Polish"
					}, {
						"key": "pt",
						"text": "Portuguese (Brazil)"
					}, {
						"key": "1p",
						"text": "Portuguese (Portugal)"
					}, {
						"key": "ro",
						"text": "Romanian"
					}, {
						"key": "ru",
						"text": "Russian"
					}, {
						"key": "sr",
						"text": "Serbian"
					}, {
						"key": "sh",
						"text": "Serbian (Latin)"
					}, {
						"key": "sk",
						"text": "Slovak"
					}, {
						"key": "sl",
						"text": "Slovenian"
					}, {
						"key": "0s",
						"text": "Spanish (Colombia)"
					}, {
						"key": "es",
						"text": "Spanish (Spain)"
					}, {
						"key": "sv",
						"text": "Swedish"
					}, {
						"key": "th",
						"text": "Thai"
					}, {
						"key": "tr",
						"text": "Turkish"
					}, {
						"key": "uk",
						"text": "Hebrew"
					}, {
						"key": "hi",
						"text": "Hindi"
					}, {
						"key": "hu",
						"text": "Ukrainian"
					}, {
						"key": "vi",
						"text": "Vietnamese"
					}, {
						"key": "ja",
						"text": "Japanese"
					}]
				};
			},

			onInit: function () {

				var oData = this.defineData();
				var oModel = new JSONModel(oData);
				this.getView().setModel(oModel);
				this.getView().byId("idTo").setSelectedKey("pt");
				this.getView().byId("idFrom").setSelectedKey("en");
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getTarget("Page").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			},

			translate: function () {

				var apiKey = this.getView().getModel("demo").getProperty("/ApiKey");

				var oModel = new sap.ui.model.json.JSONModel();
				var langFrom = this.getView().byId("idFrom").getSelectedKey();
				var langTo = this.getView().byId("idTo").getSelectedKey();
				var oldText = this.getView().byId("idOldText").getValue();

				var sHeaders = {
					"Content-Type": "application/json",
					"APIKey": apiKey
				};

				var oData = {
					"sourceLanguage": langFrom,
					"targetLanguages": [langTo],
					"units": [{
						"value": oldText,
						"key": apiKey
					}]
				};

				var ODataJSON = JSON.stringify(oData);
				var that = this;

				oModel.loadData("/ml-dest/translation/translation", ODataJSON, true, "POST", null, false, sHeaders);
				oModel.attachRequestCompleted(function (oEvent) {
					oData = oEvent.getSource().oData;
					var newText = "The text was not translated";
					if (!that.isEmptyObject(oData)) {
						newText = oData.units[0].translations[0].value;
						that.getView().byId("idNewText").setValue(newText);
					} else {
						that.getView().byId("idNewText").setValue(newText);
					}
				});

			},

			isEmptyObject: function (obj) {
				var name;
				for (name in obj) {
					return false;
				}
				return true;
			},

			change: function (oEvent) {
				var oldText = this.getView().byId("idOldText").getValue();
				var newText = this.getView().byId("idNewText").getValue();
				this.getView().byId("idOldText").setValue(newText);
				this.getView().byId("idNewText").setValue(oldText);
				var langTo = this.getView().byId("idTo").getSelectedKey();
				var langFrom = this.getView().byId("idFrom").getSelectedKey();
				this.getView().byId("idTo").setSelectedKey(langFrom);
				this.getView().byId("idFrom").setSelectedKey(langTo);
			}
		});
	}, /* bExport= */
	true);