import _ from 'lodash';
import Print from './print';

function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.onclick = Print.bind(null, 'hello webpack!');

  return element;
}

document.body.appendChild(component());