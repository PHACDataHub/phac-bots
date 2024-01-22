exports.creatingProject =       
    {"blocks": [
        {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Processing project creation request"
        }
    }]
  }

exports.invalidCommand =       
    {"blocks": [
        {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Invalid Command"
        }
    }]
  }
  
exports.projectDetailsForm = 
    {"blocks": [
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Please Enter Project details:"
        }
    },
    {
        "type": "input",
        "optional": false,
        "element": {
          "type": "plain_text_input",
          "action_id": "project-vanity-name"
        },
        "label": {
          "type": "plain_text",
          "text": "Project Name",
          "emoji": true
        }
    },
    {
        "type": "input",
        "element": {
            "type": "plain_text_input",
            "action_id": "project-dept"
        },
        "label": {
            "type": "plain_text",
            "text": "Project Department",
            "emoji": true
        }
    },
    {
        "type": "input",
        "element": {
            "type": "plain_text_input",
            "action_id": "project-classification"
        },
        "label": {
            "type": "plain_text",
            "text": "Project Classification",
            "emoji": true
        }
    },
    {
        "type": "input",
        "element": {
            "type": "plain_text_input",
            "action_id": "project-env"
        },
        "label": {
            "type": "plain_text",
            "text": "Project Environment",
            "emoji": true
        }
    },
    {
        "type": "input",
        "element": {
            "type": "multi_static_select",
            "placeholder": {
            "type": "plain_text",
            "text": "Select options",
            "emoji": true
            },
            "options": [
                {
                    "text": {
                    "type": "plain_text",
                    "text": "momo",
                    "emoji": true
                    },
                    "value": "momo"
                },
                {
                    "text": {
                    "type": "plain_text",
                    "text": "kitcat",
                    "emoji": true
                    },
                    "value": "kitcat"
                },
                {
                    "text": {
                    "type": "plain_text",
                    "text": "oreo",
                    "emoji": true
                    },
                    "value": "oreo"
                },
                {
                    "text": {
                    "type": "plain_text",
                    "text": "rick",
                    "emoji": true
                    },
                    "value": "rick"
                },
                {
                    "text": {
                    "type": "plain_text",
                    "text": "morty",
                    "emoji": true
                    },
                    "value": "morty"
                }],
            "action_id": "members"
            },
            "label": {
            "type": "plain_text",
            "text": "owners",
            "emoji": true
            }
      },  
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Submit Details",
              "emoji": true
            },
            "style" : "primary",
            "confirm": {
                		"title": {
							"type": "plain_text",
							"text": "Confirm Submission"
						},
						"confirm": {
							"type": "plain_text",
							"text": "Yes"
						},
						"deny": {
							"type": "plain_text",
							"text": "No"
						}
            },
            "value": "submit_project_create",
            "action_id": "submit_project_create_data"
          }
        ]
      }
    ]}