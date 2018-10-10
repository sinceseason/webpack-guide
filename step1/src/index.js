import _ from 'lodash';
import './style/style.css';
import R8 from './img/r8.jpg';
import Data from './data.xml';

function component() {
    var element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    var myIcon = new Image();
    myIcon.src = R8;
    element.appendChild(myIcon);

    console.log(Data);

    return element;
}

document.body.appendChild(component());