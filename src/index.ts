import schema from './json-rpc-api-schema.ts';
import {validateDocument} from './open_rpc/validate_document.ts';


validateDocument(schema)
