const generateConfig = {
	moduleName: "Terms",
    routeVersion: "v1",
	isUnique: true, // Will be used in controller(Create) to determine the param
	parameters: [
		{
			name: "terms", // Name of the param
			sensitive: false, // To hide information like password
			type: "String",
			isUploadable: false, // Will be used in frontend for using input="file"
			isRequired: true, // Will be used in Interface
			isSearchable: false, // Will be used in controller(Get Many)
			isEditable: false, // Will be used in Validation and Interface
			isUnique: false, // Will be used in controller(Create) to determine the param
			isValidationRequired: false // Will be used in Validation
		},
		{
			name: "user",
			sensitive: false,
			type: "String",
			isUploadable: false,
			isRequired: true,
			isValidationRequired: false,
			isSearchable: false,
			isEditable: false,
			ref:"user"
		},
		{
			name: "summary",
			sensitive: false,
			type: "String",
			isUploadable: false,
			isRequired: false,
			isValidationRequired: false,
			isSearchable: false,
			isEditable: false,
		},
		{
			name: "summary_prompt",
			sensitive: false,
			type: "String",
			isUploadable: false,
			isRequired: false,
			isValidationRequired: false,
			isSearchable: false,
			isEditable: false,
		},
		{
			name: "problem",
			sensitive: false,
			type: "String",
			isUploadable: false,
			isRequired: false,
			isValidationRequired: false,
			isSearchable: false,
			isEditable: false,
		},
		{
			name: "problem_prompt",
			sensitive: false,
			type: "String",
			isUploadable: false,
			isRequired: false,
			isValidationRequired: false,
			isSearchable: false,
			isEditable: false,
		},
	],
};

module.exports = generateConfig;
