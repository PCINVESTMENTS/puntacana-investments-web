var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// run_migration.js
var fs = require('fs');
var axios = require('axios');
var API_URL = 'https://puntacana-fortress-production.up.railway.app/api/properties/';
var API_KEY = '5831603befa06e295a98bdb4acfc3c65b777b89f52f267e62527e6557c591591';
function migrate() {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, arrayStrMatch, properties, success, index, _i, properties_1, prop, rawImageUrl, seoDesc, safeSlug, payload, firstError_1, e_1, html, tracebackMatch, exceptionMatch, exceptionLocationMatch, lines, e_2;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    _u.trys.push([0, 13, , 14]);
                    console.log("🚀 Bypassing TS modules. Reading raw properties.ts...");
                    fileContent = fs.readFileSync('./src/data/properties.ts', 'utf8');
                    arrayStrMatch = fileContent.match(/export const properties: Property\[\] = (\[[\s\S]*\]);/);
                    if (!arrayStrMatch) {
                        console.error("❌ Failed to parse properties array from file.");
                        return [2 /*return*/];
                    }
                    properties = eval(arrayStrMatch[1]);
                    console.log("\u2705 Successfully parsed ".concat(properties.length, " properties via Regex/Eval. Starting Migration..."));
                    success = 0;
                    index = 0;
                    _i = 0, properties_1 = properties;
                    _u.label = 1;
                case 1:
                    if (!(_i < properties_1.length)) return [3 /*break*/, 12];
                    prop = properties_1[_i];
                    _u.label = 2;
                case 2:
                    _u.trys.push([2, 10, , 11]);
                    index++;
                    console.log("\u23F3 Migrating [".concat(prop.id, "] ").concat(prop.title, "..."));
                    rawImageUrl = prop.image || '';
                    if (rawImageUrl && rawImageUrl.startsWith('/')) {
                        rawImageUrl = "https://puntacanainvestmentsrd.com".concat(rawImageUrl);
                    }
                    else if (!rawImageUrl) {
                        rawImageUrl = 'https://puntacanainvestmentsrd.com/images/default-property.jpg';
                    }
                    seoDesc = ((_b = (_a = prop.seo) === null || _a === void 0 ? void 0 : _a.description) === null || _b === void 0 ? void 0 : _b.es) || ((_d = (_c = prop.description) === null || _c === void 0 ? void 0 : _c.es) === null || _d === void 0 ? void 0 : _d.substring(0, 150)) || '';
                    if (seoDesc.length > 158)
                        seoDesc = seoDesc.substring(0, 155) + '...';
                    safeSlug = (((_e = prop.slug) === null || _e === void 0 ? void 0 : _e.toLowerCase().replace(/[^a-z0-9-]+/g, '-')) || "prop-".concat(Date.now())) + "-".concat(index);
                    payload = {
                        title: ((_f = prop.title) === null || _f === void 0 ? void 0 : _f.substring(0, 100)) || 'Untitled',
                        slug: safeSlug,
                        description: ((_g = prop.description) === null || _g === void 0 ? void 0 : _g.es) || 'Sin descripción',
                        description_en: ((_h = prop.description) === null || _h === void 0 ? void 0 : _h.en) || '',
                        price: parseFloat(prop.price) || 0,
                        is_rental_active: prop.status === 'rent',
                        rental_price: prop.status === 'rent' ? (parseFloat(prop.price) || 0) : null,
                        bedrooms: parseInt(prop.beds) || 0,
                        bathrooms: parseInt(prop.baths) || 0,
                        area_sqm: parseFloat(prop.area) || 0,
                        location_label: ((_j = prop.locationLabel) === null || _j === void 0 ? void 0 : _j.substring(0, 100)) || 'Punta Cana',
                        status: prop.status === 'rent' ? 'Disponible' : 'Disponible',
                        is_featured: prop.featured || false,
                        main_image_url: rawImageUrl,
                        gallery_urls: [rawImageUrl],
                        seo_title: (_m = (((_l = (_k = prop.seo) === null || _k === void 0 ? void 0 : _k.title) === null || _l === void 0 ? void 0 : _l.es) || prop.title)) === null || _m === void 0 ? void 0 : _m.substring(0, 60),
                        seo_description: seoDesc,
                        latitude: ((_o = prop.coordinates) === null || _o === void 0 ? void 0 : _o.lat) || 18.582,
                        longitude: ((_p = prop.coordinates) === null || _p === void 0 ? void 0 : _p.lng) || -68.405,
                        features: prop.features || { es: [], en: [] },
                        detailed_sections: prop.detailedSections || [],
                        construction_stages: prop.constructionStages || [],
                        completion_percent: prop.completionPercent || 0
                    };
                    _u.label = 3;
                case 3:
                    _u.trys.push([3, 5, , 9]);
                    return [4 /*yield*/, axios.post(API_URL, payload, {
                            headers: {
                                'X-API-KEY': API_KEY,
                                'Content-Type': 'application/json'
                            }
                        })];
                case 4:
                    _u.sent();
                    console.log("\u2705 Success: ".concat(prop.title));
                    success++;
                    return [3 /*break*/, 9];
                case 5:
                    firstError_1 = _u.sent();
                    if (!(((_q = firstError_1.response) === null || _q === void 0 ? void 0 : _q.status) === 500 || ((_r = firstError_1.response) === null || _r === void 0 ? void 0 : _r.status) === 400)) return [3 /*break*/, 7];
                    console.warn("\u26A0\uFE0F Slug conflict for ".concat(prop.title, ". Retrying with unique suffix..."));
                    payload.slug = "".concat(payload.slug, "-").concat(Date.now().toString().slice(-4));
                    return [4 /*yield*/, axios.post(API_URL, payload, {
                            headers: {
                                'X-API-KEY': API_KEY,
                                'Content-Type': 'application/json'
                            }
                        })];
                case 6:
                    _u.sent();
                    console.log("\u2705 Success (Suffixed): ".concat(prop.title));
                    success++;
                    return [3 /*break*/, 8];
                case 7: throw firstError_1;
                case 8: return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_1 = _u.sent();
                    console.error("\u274C Failed to migrate ".concat(prop.title, ": HTTP ").concat((_s = e_1.response) === null || _s === void 0 ? void 0 : _s.status));
                    if ((_t = e_1.response) === null || _t === void 0 ? void 0 : _t.data) {
                        html = typeof e_1.response.data === 'string' ? e_1.response.data : JSON.stringify(e_1.response.data);
                        tracebackMatch = html.match(/<div class="traceback">([\s\S]*?)<\/div>/i);
                        exceptionMatch = html.match(/<th>Exception Value:<\/th>\s*<td><pre>([^<]+)<\/pre><\/td>/i);
                        exceptionLocationMatch = html.match(/<th>Exception Location:<\/th>\s*<td>([^<]+)<\/td>/i);
                        console.log("------------------------");
                        if (exceptionMatch)
                            console.log("Exception:", exceptionMatch[1].trim());
                        if (exceptionLocationMatch)
                            console.log("Location:", exceptionLocationMatch[1].trim());
                        // Simple text extraction of the inner traceback lines
                        if (tracebackMatch) {
                            lines = tracebackMatch[1].replace(/<[^>]+>/g, '').split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l; });
                            console.log("Traceback:");
                            console.log(lines.slice(-15).join('\n'));
                        }
                        else {
                            console.log("No traceback block found in HTML. Check last_django_error.html");
                        }
                        console.log("------------------------");
                        fs.writeFileSync('last_django_error.html', html);
                    }
                    else {
                        console.error(e_1.message);
                    }
                    return [3 /*break*/, 12]; // Stop on first failure to debug
                case 11:
                    _i++;
                    return [3 /*break*/, 1];
                case 12:
                    console.log("\uD83C\uDF89 Migration Complete! Successfully migrated ".concat(success, "/").concat(properties.length, " properties."));
                    return [3 /*break*/, 14];
                case 13:
                    e_2 = _u.sent();
                    console.error("❌ Fatal Error in migration script:", e_2);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
migrate();
