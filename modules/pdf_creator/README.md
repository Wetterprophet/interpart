# Interpart pdf creator

## Setup

* install weasyprint: `sudo pip3 install WeasyPring`
    * weasyprint might need additional dependencies: https://weasyprint.readthedocs.io/en/stable/install.html

* istall dependencies with `npm install`
* run `npm link`
* test script with `interop-pdf --submission "{}"` and check if pdf was created in output folder

* setup printer as standard printer
    * test it with `lp document_name`

## Usage

run `interpart-pdf --submission "{}"` to create empty odf in output folder. run `interpar-pdf --help"` for options