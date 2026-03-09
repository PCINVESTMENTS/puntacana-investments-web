import * as z from "zod";

// Helper for file validation (mock)
const fileSchema = z.any().optional(); // Strict file validation is hard without FileList in Node env, kept loose for now.

export const personaFisicaSchema = z.object({
    customerCode: z.string().optional(),
    date: z.date({ required_error: "Fecha requerida" }),
    idType: z.string().min(1, "Seleccione un tipo"),
    idDocument: z.string().min(1, "Documento requerido"),
    firstName: z.string().min(1, "Nombres requeridos"),
    lastName: z.string().min(1, "Apellidos requeridos"),
    email: z.string().email("Email inválido"),
    gender: z.enum(["femenino", "masculino"], { required_error: "Seleccione género" }),
    birthDate: z.date({ required_error: "Fecha nacimiento requerida" }),
    birthPlace: z.string().min(1, "Lugar nacimiento requerido"),
    nationality: z.string().min(1, "Nacionalidad requerida"),
    maritalStatus: z.string().min(1, "Estado civil requerido"),
    homePhone: z.string().optional(),
    mobilePhone1: z.string().min(1, "Celular requerido"),
    mobilePhone2: z.string().optional(),
    address: z.string().min(1, "Dirección requerida"),
    province: z.string().optional(),
    state: z.string().optional(),
    residenceCountry: z.string().min(1, "País requerido"),

    // Spouse
    hasSpouse: z.enum(["si", "no"], { required_error: "Requerido" }),
    spouseFirstName: z.string().optional(),
    spouseLastName: z.string().optional(),
    spouseIdType: z.string().optional(),
    spouseIdDocument: z.string().optional(),
    spouseBirthDate: z.date().optional(),
    spouseBirthPlace: z.string().optional(),
    spouseNationality: z.string().optional(),
    spouseEmail: z.string().optional(),
    spouseHomePhone: z.string().optional(),
    spouseMobilePhone: z.string().optional(),

    // Occupation
    profession: z.string().min(1, "Requerido"),
    professionOther: z.string().optional(),
    position: z.string().min(1, "Requerido"),
    positionOther: z.string().optional(),
    company: z.string().optional(),
    monthlyIncome: z.string().optional(),
    hasOtherIncome: z.enum(["si", "no"]).optional(),
    otherIncomeSource: z.string().optional(),
    otherIncomeSourceOther: z.string().optional(),
    otherIncomeAmount: z.string().optional(),
    incomeUSD: z.string().optional(),

    // PEP
    isPEP: z.enum(["si", "no"], { required_error: "Requerido" }),
    fundsOrigin: z.string().min(1, "Origen de fondos requerido"),
    pepPosition: z.string().optional(),
    pepInstitution: z.string().optional(),
    pepCountry: z.string().optional(),

    // References
    personalReferences: z.array(z.object({
        name: z.string(),
        relationship: z.string(),
        phone: z.string()
    })).optional(),
    commercialReferences: z.array(z.object({
        entity: z.string(),
        relationshipType: z.string(),
        phone: z.string()
    })).optional(),
    bankReferences: z.array(z.object({
        entity: z.string(),
        type: z.string(),
        phone: z.string()
    })).optional(),

    // Files
    idDocumentFile: fileSchema,
    proofOfFundsFile: fileSchema,
    creditBureauFile: fileSchema,
    proofOfAddressFile: fileSchema,
    workLetterFile: fileSchema,

    // Declarations
    declaration1: z.boolean().refine(val => val === true, "Debe aceptar esta declaración"),
    declarationLicitFunds: z.boolean().refine(val => val === true, "Debe aceptar esta declaración"),
    authorization: z.boolean().refine(val => val === true, "Debe aceptar esta declaración"),
    declaration4: z.boolean().refine(val => val === true, "Debe aceptar esta declaración"),

    signature: z.string().min(1, "Firma requerida"),
});

export type PersonaFisicaData = z.infer<typeof personaFisicaSchema>;

export const personaJuridicaSchema = z.object({
    customerCode: z.string().optional(),
    date: z.date({ required_error: "Fecha requerida" }),
    companyName: z.string().min(1, "Nombre empresa requerido"),
    commercialName: z.string().optional(),
    incorporationDate: z.date({ required_error: "Fecha constitución requerida" }),
    constitutionCountry: z.string().min(1, "País requerido"),
    city: z.string().min(1, "Ciudad requerida"),
    rnc: z.string().min(1, "RNC requerido"),

    // Legal Rep
    legalRepFirstName: z.string().min(1, "Nombres requeridos"),
    legalRepLastName: z.string().min(1, "Apellidos requeridos"),
    legalRepId: z.string().min(1, "ID requerido"),
    legalRepBirthDate: z.date({ required_error: "Fecha nacimiento requerida" }),
    legalRepAddress: z.string().min(1, "Dirección requerida"),
    legalRepPhone: z.string().min(1, "Teléfono requerido"),
    legalRepEmail: z.string().email("Email inválido"),
    legalRepProfession: z.string().min(1, "Requerido"),
    legalRepProfessionOther: z.string().optional(),
    legalRepPosition: z.string().min(1, "Requerido"),
    legalRepPositionOther: z.string().optional(),
    legalRepDesignation: z.string().min(1, "Designación requerida"),
    isPEP: z.enum(["si", "no"], { required_error: "Requerido" }),
    pepPosition: z.string().optional(),
    pepInstitution: z.string().optional(),
    pepCountry: z.string().optional(),

    // Econ
    averageIncome: z.string().optional(),
    annualIncome: z.string().optional(),
    incomeUSD: z.string().optional(),
    fundsOrigin: z.string().min(1, "Origen de fondos requerido"),

    // Files
    commercialRegistryFile: fileSchema,
    legalRepIdFile: fileSchema,
    shareholderAssemblyFile: fileSchema,
    authorizedSignaturesFile: fileSchema,
    shareholderListFile: fileSchema,
    financialStatementsFile: fileSchema,

    // Declarations
    declaration: z.boolean().refine(val => val === true, "Debe aceptar esta declaración"),
    declaration2: z.boolean().refine(val => val === true, "Debe aceptar esta declaración"),
    authorization: z.boolean().refine(val => val === true, "Debe aceptar esta declaración"),
    declaration4: z.boolean().refine(val => val === true, "Debe aceptar esta declaración"),

    signature: z.string().min(1, "Firma requerida"),
});

export type PersonaJuridicaData = z.infer<typeof personaJuridicaSchema>;
