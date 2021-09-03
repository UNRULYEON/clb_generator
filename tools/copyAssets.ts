import * as shell from "shelljs";

shell.ls('.')
shell.cp( "-R", "client/build", "dist/client" );