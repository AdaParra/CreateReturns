sap.ui.define([
	"CreateReturns/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("CreateReturns.controller.CreateReturns", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf CreateReturns.view.view.CreateReturns
		 */
			onInit: function() {

				this.getRouter().getRoute("createreturns").attachPatternMatched(this._onRouteMatched, this);

			},

			_onRouteMatched: function(oEvent) {

				this.oView = this.getView();

				//Modelo Local
				this.oModel = this.getView().getModel("localData");

				this._wizard = this.getView().byId("CreateProductWizard");
				this._oNavContainer = this.getView().byId("wizardNavContainer");
				this._oWizardContentPage = this.getView().byId("wizardContentPage");
							
				this._oWizardReviewPage = sap.ui.xmlfragment("CreateReturns.view.ReviewPage", this);
				this._oNavContainer.addPage(this._oWizardReviewPage);


			},
			
			onSearch: function (event) {
				//console.log(event);
				let oSF = event.getSource();
				const item = event.getParameter("suggestionItem");
				let onIndex = this.oView.byId(oSF.sId).sId;
				const onLength = this.oView.byId(oSF.sId).sId.length;

				if (item) {
					this.oModel.setProperty("/DataSelect/0/" + this.oView.byId(oSF.sId).getPlaceholder() + "/", item.getText());
					/*console.log(parseInt(this.oView.byId(oSF.sId).sId[onLength-1])+1);*/
					let onString = (parseInt(this.oView.byId(oSF.sId).sId[onLength-1])+1).toString();
					onIndex = onIndex.replace("-" + this.oView.byId(oSF.sId).sId[onLength-1], "-" + onString);
					/*console.log(onIndex);*/

					if (parseInt(this.oView.byId(oSF.sId).sId[onLength-1])+1 < 9) {
						this.oView.byId(onIndex).setEnabled(true);
					}


					if (this.oView.byId("__xmlview1--searchField-6").getValue()) {
						this._wizard.validateStep(this.getView().byId("InitAppStep"));
					}else{
						this._wizard.invalidateStep(this.getView().byId("InitAppStep"));
					}

					if (this.oView.byId("__xmlview1--searchField-8").getValue()) {
						this._wizard.validateStep(this.getView().byId("InvoiceInfoStep"));
					}else{
						this._wizard.invalidateStep(this.getView().byId("InvoiceInfoStep"));
					}
				}
			},
			

			onSuggest_: function(event){
				
				let oSF = event.getSource();
				this.onSuggest(event, oSF);

			},

			onSuggest: function (event, oSF) {

					var value = event.getParameter("suggestValue");
					/*console.log(oSF.sId);*/

					var filters = [];
					if (value) {
						filters = [new sap.ui.model.Filter([
				                   new sap.ui.model.Filter("name", function(sText) {
					                   return (sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
					}),
					               new sap.ui.model.Filter("name", function(sDes) {
						               return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
					})], false)];
					}
		 
					oSF.getBinding("suggestionItems").filter(filters);
					oSF.suggest();
					
					
				},

			onLiveChange: function(event){
				console.log(event);
				this._wizard.invalidateStep(this.getView().byId("InitAppStep"));
				this._wizard.invalidateStep(this.getView().byId("InvoiceInfoStep"));
			},

			//Rango de Fecha
			handleChange: function(oEvent){
				console.log(this.oView.byId("DRS2"));
				this.oModel.setProperty("/DataSelect/0/r_fechas/", this.oView.byId("DRS2")._getInputValue());
				this.oModel.setProperty("/DataSelect/0/fecha_factura/", this.oView.byId("DRS2").getSecondDateValue());
			},

			onSelectCheck: function(oEvent){

				let index = oEvent.getSource().sId;
				index = parseInt(index[35]);
				
				const oModel = this.getView().getModel("localData");

				oModel.setProperty("/arrayData_02/" + index + "/check", oEvent.getSource().getSelected());

				console.log(oEvent.getSource().getSelected());

				console.log(oModel);
			},

			onChangeInput: function(oEvent){
				console.log(oEvent.getSource().getValue());
				let index = oEvent.getSource().sId;
				index = parseInt(index[35]);
				const oModel = this.getView().getModel("localData");
				oModel.setProperty("/arrayData_02/" + index + "/cant", oEvent.getSource().getValue());
				console.log(oModel);
			},

			wizardCompletedHandler : function () {
				this._oNavContainer.to(this._oWizardReviewPage);
			},

			_handleNavigationToStep : function (iStepNumber) {
				var that = this;
				function fnAfterNavigate () {
					that._wizard.goToStep(that._wizard.getSteps()[iStepNumber]);
					that._oNavContainer.detachAfterNavigate(fnAfterNavigate);
				}
	 
				this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
				this.backToWizardContent();
			},

			editStepOne : function () {
				this._handleNavigationToStep(0);
			},
			editStepTwo : function () {
					this._handleNavigationToStep(1);
			},
			editStepThree : function () {
					this._handleNavigationToStep(2);
			},

			backToWizardContent : function () {
				this._oNavContainer.backToPage(this._oWizardContentPage.getId());
			},


			handleWizardSubmit : function () {
				this._handleMessageBoxOpen("Esta seguro que desea crear esta devolucion?", "confirm");
			},

			_handleMessageBoxOpen : function (sMessage, sMessageBoxType) {
				var that = this;
				sap.m.MessageBox[sMessageBoxType](sMessage, {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {
							that._handleNavigationToStep(0);
							that._wizard.discardProgress(that._wizard.getSteps()[0]);
							that._resetData();
						}
					},
				});
			},

			InitAppStepValidation: function(){
				console.log("Entro");
			},

			/*Funcion que resetea la informacion suministrada en todos los inputs, 
			searchField en la app*/

			_resetData: function(){

				this.oView.byId("searchField-1").setValue("");
				this.oView.byId("searchField-2").setValue("").setEnabled(false);
				this.oView.byId("searchField-3").setValue("").setEnabled(false);
				this.oView.byId("searchField-4").setValue("").setEnabled(false);
				this.oView.byId("searchField-5").setValue("").setEnabled(false);
				this.oView.byId("searchField-6").setValue("").setEnabled(false);
				this.oView.byId("searchField-7").setValue("").setEnabled(false);
				this.oView.byId("searchField-8").setValue("").setEnabled(false);
				this.oView.byId("DRS2").setValue("");


				this._wizard.invalidateStep(this.getView().byId("InitAppStep"));
				this._wizard.invalidateStep(this.getView().byId("InvoiceInfoStep"));

				this.oModel.setProperty("/DataSelect/0/",{
					"id": 0,
					"Organizacion de Ventas": "",
					"Canal de Distribución": "",
					"Sector": "",
					"Oficina de Ventas": "",
					"Grupo de Vendedores": "",
					"Clase de Documento": "",
					"Cliente": "",
					"Facturas": "",
					"r_fechas": "",
					"fecha_factura": ""
				});

				this.oModel.setProperty("/arrayData_02/",[{
					"id": 0,
					"check": false,
					"name": "Material 001",
					"cant": 1,
					"cost": 20000,
					"montoNeto": 3000
				},
				{
					"id": 1,
					"check": false,
					"name": "Material 002",
					"cant": 2,
					"cost": 35000,
					"montoNeto": 4000
				}]);
				console.log(this.oModel);
			}

	});

});