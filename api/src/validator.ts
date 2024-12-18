import Ajv from 'ajv';
const ajv = new Ajv({removeAdditional: 'all', strict: false, allErrors: true});

ajv.addFormat('integer', /^\d+$/)
ajv.addFormat('boolean', /^(true|false)$/i)
ajv.addFormat('outcome', /^(pass|fail|error|unknown)$/i)

const validate = async (schema: object, data: any) => {
    try {
        const validator = ajv.compile(schema);
        const valid = await validator(data);
        if(!valid)
            return ajv.errorsText(validator.errors);
        return true;
    } catch (err) {
        return err.message;
    }
}

export {validate}
