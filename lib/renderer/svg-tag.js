const Utils = require('./utils');

function getColorAttrib (color, attrib) {
  const alpha = color.a / 255;
  const str = attrib + '="' + color.hex + '"';

  return alpha < 1
    ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"'
    : str;
}


function drawRect(x, y, width, height) {
  return `M ${x.toFixed(2)}, ${y.toFixed(2)} V ${(y + height).toFixed(2)} H ${(x + width).toFixed(2)} V ${y.toFixed(2)} H ${x.toFixed(2)} Z `;
}


function qrToPath (data, size, margin, width) {

  let path = "";

  for(let i = 0; i < data.length; i++) {

    const col = Math.floor(i % size);
    const row = Math.floor(i / size);

    const rectSize = (width - margin * 2) / size;

    if(data[i]){
      path += drawRect(col * rectSize, row * rectSize, rectSize, rectSize);
    }

  }

  return path;
  
}

exports.render = function render (qrData, options, cb){

  const opts = Utils.getOptions(options);
  const size = qrData.modules.size;
  const data = qrData.modules.data;
  const qrcodesize = size + opts.margin * 2;

  const bg = !opts.color.light.a
    ? ''
    : '<path ' + getColorAttrib(opts.color.light, 'fill') +
      ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>';

  const path =
    '<path ' + getColorAttrib(opts.color.dark, 'fill') +
    ' d="' + qrToPath(data, size, opts.margin, opts.width) + '"/>';

  const width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '"';

  const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + ' shape-rendering="crispEdges">' + bg + path + '</svg>\n'

  if(typeof cb === 'function') {
    cb(null, svgTag);
  }

  return svgTag;

}