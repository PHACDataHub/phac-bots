# Task Automation using Slack Bots
Welcome, to the home for PHAC-bots. These bots will endeavour to make our lives at PHAC better, with their magic of automation!

## About
Slack Bots serve as an aid in expediting tasks. The current state of the organization involves manual intervention at various levels(administrative and technical) which ultimately hinders productivity. Slack bots can be used to improve efficiency at both the administrative and technical level.

## Current State
At the moment there are a few areas that have been identified where bots can come into play :
1. Automating the creation of projects and allocating other resrouces (Virtual Machines, Notebooks, Pipelines, etc.) on Google Cloud Platform (GCP).
2. Automated streaming and filtering of Security Command Center notifications (SCC) from GCP, to provide higher observability and quicker response times to potential vulnerabilities.
3. Automating administrative tasks such as leave applications, etc.

## Proposed Solutions
There are some soultions that have been sucessfully built and are currently in a Proof of Concept State :
1. A [Slack Bot](https://github.com/PHACDataHub/phac-bots/tree/master/project-maker-bot) for creating projects has been deployed in a private channel within slack. Upon invocation the user fills up a form with requisite details and in no time a GCP Project is ready. This functionality can and will be extended to provision other resources in GCP.
2. A [Slack Bot](https://github.com/PHACDataHub/phac-bots/tree/master/SCCSlackBot) that streams security notifications from the Security Command Center into a private channel within Slack. Future versions will have filtering capabilites.

## Business Value
There is value in using Slack Bots on a day to day basis within the organization :
1. They help increasing efficiency, without compromising security.
2. They completely mitigate chances of human error.
3. They have a lower overhead than building and maintaining individual web applications, thereby bringing down operational costs.


