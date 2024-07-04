sap.ui.define(
    [
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "Task/workflowuimodule/model/models",
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend(
            "Task.workflowuimodule.Component",
            {
                metadata: {
                    manifest: "json",
                },

                /**
                 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
                 * @public
                 * @override
                 */
                init: function () {
                    // call the base component's init function
                    UIComponent.prototype.init.apply(this, arguments);

                    // enable routing
                    this.getRouter().initialize();

                    // set the device model
                    this.setModel(models.createDeviceModel(), "device");

                    this.setTaskModels();

                    const submitOutcomeId = "submit";
                    this.getInboxAPI().addAction(
                        {
                            action: submitOutcomeId,
                            label: "Submit",
                            type: "accept",
                        },
                        function () {
                            this.completeTask(true, submitOutcomeId);
                        },
                        this
                    );
                },

                setScoreInContext: function (score) {
                    var oContextModel = this.getModel("context");
                    oContextModel.setProperty("/outText", score);
                    var submitOutcomeId = "submit"; // Replace with your outcome ID if different
                    this.completeTask(true, submitOutcomeId); // Assuming you have a completeTask function
                },

                setTaskModels: async function () {
                    // set the task model
                    var startupParameters = this.getComponentData().startupParameters;
                    this.setModel(startupParameters.taskModel, "task");

                    // set the task context model
                    var taskContextModel = new sap.ui.model.json.JSONModel(
                        this._getTaskInstancesBaseURL() + "/context"
                    );
                    this.setModel(taskContextModel, "context");

                    // parse Date objects and set in own model
                    await taskContextModel.loadData(this._getTaskInstancesBaseURL() + "/context");
                },

                _getTaskInstancesBaseURL: function () {
                    return (
                        this._getWorkflowRuntimeBaseURL() +
                        "/task-instances/" +
                        this.getTaskInstanceID()
                    );
                },

                _getWorkflowRuntimeBaseURL: function () {  
                    var ui5CloudService = this.getManifestEntry("/sap.cloud/service").replaceAll(".", "");  
                    var ui5ApplicationName = this.getManifestEntry("/sap.app/id").replaceAll(".", "");  
                    var appPath = `${ui5CloudService}.${ui5ApplicationName}`;
                    return `/${appPath}/api/public/workflow/rest/v1`
                },

                getTaskInstanceID: function () {
                    return this.getModel("task").getData().InstanceID;
                },

                getInboxAPI: function () {
                    var startupParameters = this.getComponentData().startupParameters;
                    return startupParameters.inboxAPI;
                },

                completeTask: function (submitStatus, outcomeId) {
                    this.getModel("context").setProperty("/submitted", submitStatus);
                    this._patchTaskInstance(outcomeId);
                },

                _patchTaskInstance: function (outcomeId) {
                    const context = this.getModel("context").getData();
                    var data = {
                        status: "COMPLETED",
                        context: { ...context, comment: context.comment || '' },
                        decision: outcomeId //submit
                    };

                    jQuery.ajax({
                        url: `${this._getTaskInstancesBaseURL()}`,
                        method: "PATCH",
                        contentType: "application/json",
                        async: true,
                        data: JSON.stringify(data),
                        headers: {
                            "X-CSRF-Token": this._fetchToken(),
                        },
                    }).done(() => {
                        this._refreshTaskList(); 
                    });
                },

                _fetchToken: function () {
                    var fetchedToken;

                    jQuery.ajax({
                        url: this._getWorkflowRuntimeBaseURL() + "/xsrf-token",
                        method: "GET",
                        async: false,
                        headers: {
                            "X-CSRF-Token": "Fetch",
                        },
                        success(result, xhr, data) {
                            fetchedToken = data.getResponseHeader("X-CSRF-Token");
                        },
                    });
                    return fetchedToken;
                },

                _refreshTaskList: function () {
                    this.getInboxAPI().updateTask("NA", this.getTaskInstanceID());
                },
            }
        );
    }
);
