const generateConfig = {
	moduleName: "Sample",
	isUnique: true, // Will be used in controller(Create) to determine the param
	parameters: [
		{
			name: "name", // Name of the param
			sensitive: false, // To hide information like password
			type: "String",
			isUploadable: false, // Will be used in frontend for using input="file"
			isRequired: true, // Will be used in Interface
			isSearchable: true, // Will be used in controller(Get Many)
			isEditable: true, // Will be used in Validation and Interface
			isUnique: true, // Will be used in controller(Create) to determine the param
			isValidationRequired: true // Will be used in Validation
		},
		{
			name: "email",
			sensitive: false,
			type: "String",
			isUploadable: false,
			isRequired: true,
			isValidationRequired: true,
			isSearchable: true,
			isEditable: true,
		},
		{
			name: "profile_picture",
			sensitive: false,
			type: "String",
			isUploadable: true,
			isRequired: true,
			isValidationRequired: true,
			isSearchable: true,
			isEditable: true,
		},
		{
			name: "created_by",
			sensitive: false,
			type: "String",
			isUploadable: false,
			isRequired: false,
			ref: "user",
			isSearchable: false,
			isEditable: false,
		},
	],
};

export default generateConfig;
