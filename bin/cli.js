#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _os = _interopRequireDefault(require("os"));

var dotenv = _interopRequireWildcard(require("dotenv"));

var _path = _interopRequireDefault(require("path"));

var _url = require("url");

var _axios = _interopRequireDefault(require("axios"));

var _enquirer = _interopRequireDefault(require("enquirer"));

var _colors = _interopRequireDefault(require("colors"));

var _index = require("./helpers/index.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var homedir = _os["default"].homedir();

var _filename = (0, _url.fileURLToPath)(import.meta.url);

var _dirname = _path["default"].dirname(_filename);

var config = process.env.NODE_ENV === 'dev' ? {
  path: _dirname + '/.env'
} : {
  path: homedir + '/cli-mr-creator/.env'
};
dotenv.config(config);
var Form = _enquirer["default"].Form,
    Select = _enquirer["default"].Select;
var token = '';
var redmineUrl = '';
/*
* Check token and redmine url
*/

try {
  token = process.env['TOKEN'];

  if (token === void 0 || token === '') {
    throw "Veuillez spécifier le token pour accéder à l'api Gitlab dans un fichier ENV";
  }

  redmineUrl = process.env['REDMINE_URL'];
} catch (error) {
  console.log(_colors["default"].red('Erreur :'), error);
  process.exit(0);
}

var currentBranchName = (0, _index.getCurrentBranchName)();
var currentRedmineRefTicket = '';

if (redmineUrl !== void 0 || redmineUrl !== '') {
  currentRedmineRefTicket = (0, _index.buildRefTicketRedmine)(redmineUrl, currentBranchName);
}

function createMergeRequest(_x, _x2) {
  return _createMergeRequest.apply(this, arguments);
}
/*
* Config prompt
*/


function _createMergeRequest() {
  _createMergeRequest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(dataFromPrompt, mrAssignee) {
    var regex, currentProjectName, gitPath, remoteName, remoteUrl, regexOrg, org, regexApiUrl, api_url, baseUrl, currentUrlProject, headers, project, mergeRequestUrl, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            regex = /([^\/]*$)/gm;
            currentProjectName = process.cwd().match(regex);
            gitPath = process.cwd() + '/.git';
            remoteName = 'origin';
            _context.next = 7;
            return (0, _index.getRemoteUrl)(gitPath, remoteName);

          case 7:
            remoteUrl = _context.sent;
            regexOrg = /(?<=\:)(.*?)(?=\/)/;
            org = remoteUrl.match(regexOrg);
            regexApiUrl = /(?<=\@)(.*?)(?=\:)/;
            api_url = remoteUrl.match(regexApiUrl);
            baseUrl = "https://".concat(api_url[0], "/api/v4/projects");
            currentUrlProject = "".concat(baseUrl, "/").concat(org[0], "%2F").concat(currentProjectName[0]);
            headers = {
              'Private-token': token
            };
            _context.next = 17;
            return (0, _axios["default"])({
              method: 'get',
              url: currentUrlProject,
              headers: _objectSpread(_objectSpread({}, headers), {}, {
                'Content-Type': 'application/x-www-form-urlencoded'
              })
            });

          case 17:
            project = _context.sent;
            mergeRequestUrl = "".concat(baseUrl, "/").concat(project.data.id, "/merge_requests");
            mergeRequestUrl += "?source_branch=".concat(currentBranchName);
            mergeRequestUrl += "&target_branch=".concat(dataFromPrompt.target_branch);
            mergeRequestUrl += "&title=".concat(dataFromPrompt.title);
            mergeRequestUrl += "&description=".concat(dataFromPrompt.description);
            mergeRequestUrl += "&remove_source_branch=".concat(dataFromPrompt.remove_source_branch);
            mergeRequestUrl += "&squash=".concat(dataFromPrompt.squash);
            mergeRequestUrl += "&assignee_id=".concat(mrAssignee);
            _context.next = 28;
            return (0, _axios["default"])({
              method: 'post',
              url: mergeRequestUrl,
              headers: headers
            });

          case 28:
            response = _context.sent;

            if (response.status === 201) {
              console.log("Congratulations your created the Merge Request : ".concat(_colors["default"].green(response.data.title)));
              console.log("Available here : ".concat(_colors["default"].green(response.data.web_url)));
            }

            _context.next = 35;
            break;

          case 32:
            _context.prev = 32;
            _context.t0 = _context["catch"](0);

            if (_context.t0.response.status == 401) {
              console.log('Création non autorisée, la merge request existe déjà : ', _colors["default"].red(_context.t0.response.statusText), _context.t0.response.status);
            } else {
              console.log('URL : ', _colors["default"].cyan(_context.t0.response.config.url));
              console.log('Something went wrong : ', _colors["default"].red(_context.t0.response.statusText), _context.t0.response.status);
              console.log('Error message : ', _colors["default"].red(_context.t0.response.data.error));
            }

          case 35:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 32]]);
  }));
  return _createMergeRequest.apply(this, arguments);
}

var defaultChoices = {
  target_branch: 'master',
  title: currentBranchName,
  description: currentRedmineRefTicket,
  remove_source_branch: 'false',
  squash: 'false'
};
var promptForm = new Form({
  name: 'user',
  message: "Veuillez remplir les informations suivantes pour cr\xE9er votre merge request: ".concat(_colors["default"].cyan('[tab ou flèches pour se déplacer]')),
  choices: [{
    name: 'target_branch',
    message: 'Spécifiez la branche cible',
    initial: defaultChoices.target_branch
  }, {
    name: 'title',
    message: 'Entrez le nom de la merge request',
    initial: defaultChoices.title
  }, {
    name: 'description',
    message: 'Entrez votre description',
    initial: defaultChoices.description
  }, {
    name: 'remove_source_branch',
    message: 'Supprimer la branche après le merge',
    initial: defaultChoices.remove_source_branch
  }, {
    name: 'squash',
    message: 'Squash commit',
    initial: defaultChoices.squash
  }]
});
/*
* Execute prompt
*/

function executePrompts() {
  return _executePrompts.apply(this, arguments);
}

function _executePrompts() {
  _executePrompts = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var formResult, assignee, promptSelect, mrAssignee;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return promptForm.run();

          case 3:
            formResult = _context2.sent;
            _context2.next = 6;
            return (0, _index.getAssignee)();

          case 6:
            assignee = _context2.sent;
            promptSelect = new Select({
              name: 'assignee',
              message: "Veuillez s\xE9l\xE9ctionner un(e) d\xE9veloppeur(euse) pour revoir votre merge request : ".concat(_colors["default"].cyan('[tab ou flèches pour se déplacer, espace pour séléctionner]')),
              choices: assignee,
              result: function result(name) {
                var valueAssignee = this.choices.find(function (choice) {
                  if (choice.name === name) {
                    return choice.value;
                  }
                });
                return valueAssignee.value;
              }
            });
            _context2.next = 10;
            return promptSelect.run();

          case 10:
            mrAssignee = _context2.sent;
            createMergeRequest(formResult, mrAssignee);
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            console.log('error', _context2.t0);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));
  return _executePrompts.apply(this, arguments);
}

executePrompts();