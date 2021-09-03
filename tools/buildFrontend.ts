import * as shell from "shelljs";

// Copy all the view templates
shell.cd('client')
shell.exec( "yarn build" );