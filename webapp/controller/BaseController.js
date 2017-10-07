sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Button"
], function(Controller, MessageToast, MessageBox, Dialog, Button) {
	"use strict";
	return Controller.extend("CreateReturns.controller.BaseController", {
		
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		onNavBack: function(oEvent) {
			console.log("onNavBack");
			this.getRouter().navTo("createreturns", {}, false);
		},
		getI18n: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		onToast: function(message, f){
			MessageToast.show(message,{
				duration: 1500,
				width: "22em",
				onClose: f
			});
		}
	});
});