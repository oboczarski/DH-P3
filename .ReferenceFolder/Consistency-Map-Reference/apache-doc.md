series-line
broken line chart

Broken line chart relates all the data points symbol by broken lines, which is used to show the trend of data changing. It could be used in both rectangular coordinate andpolar coordinate.

Tip: When areaStyle is set, area chart will be drawn.

Tip: With visualMap component, Broken line / area chart can have different colors on different sections, as below:


Properties
series-line. type = 'line'
string
series-line. id
string
Component ID, not specified by default. If specified, it can be used to refer the component in option or API.

series-line. name
string
Series name used for displaying in tooltip and filtering with legend, or updating data and configuration with setOption.

series-line. colorBy = 'series'
string
Since v5.2.0
The policy to take color from option.color. Valid values:

'series': assigns the colors in the palette by series, so that all data in the same series are in the same color;
'data': assigns colors in the palette according to data items, with each data item using a different color.
series-line. coordinateSystem = 'cartesian2d'
string
Specifies another coordinate system component on which this series-line is laid out.

Options:

'cartesian2d'

Lay out based on a two-dimensional rectangular coordinate system (also known as Cartesian coordinate system). When multiple xAxis or multiple yAxis exist within an ECharts instance, the corresponding axes should be specified using xAxisIndex and yAxisIndex or xAxisId and yAxisId.

Note: some commonly used series, such as series-line, series-bar, etc., can not be laid out directly based on matrix coordinate system or calendar coordinate system, but they can be laid out on a grid(Cartesian), and that grid can be laid out on a matrix or calendar.

'polar'

Lay out based on a polar coordinate system. When multiple polar coordinate systems exist within an ECharts instance, the corresponding system should be specified using polarIndex or polarId.

'singleAxis'

Lay out based on a singleAxis coordinate system. When multiple singleAxis coordinate systems exist within an ECharts instance, the corresponding system should be specified using singleAxisIndex or singleAxisId.

Support for series and component layout on coordinate systems:

The leftmost column lists the series and components that will be laid out (coordinate systems themselves are also components), and the topmost row lists the coordinate systems that can be laid out on.

no coord sys	grid (cartesian2d)	polar	geo	singleAxis	radar	parallel	calendar	matrix
grid (cartesian2d)	✅	❌	❌	❌	❌	❌	❌	✅	✅
polar	✅	❌	❌	❌	❌	❌	❌	✅	✅
geo	✅	❌	❌	❌	❌	❌	❌	✅	✅
singleAxis	✅	❌	❌	❌	❌	❌	❌	✅	✅
calendar	✅	❌	❌	❌	❌	❌	❌	❌	❌
matrix	✅	❌	❌	❌	❌	❌	❌	❌	❌
series-line	❌	✅	✅	❌	❌	❌	❌	❌ (✅ if via another coord sys like grid)	❌ (✅ if via another coord sys like grid)
series-bar	❌	✅	✅	❌	❌	❌	❌	❌ (✅ if via another coord sys like grid)	❌ (✅ if via another coord sys like grid)
series-pie	✅	✅	✅	✅	✅	❌	❌	✅	✅
series-scatter	❌	✅	✅	✅	✅	❌	❌	✅	✅
series-effectScatter	❌	✅	✅	✅	✅	❌	❌	✅	✅
series-radar	❌	❌	❌	❌	❌	✅	❌	❌ (✅ if via radar coord sys)	❌ (✅ if via radar coord sys)
series-tree	✅	❌	❌	❌	❌	❌	❌	✅	✅
series-treemap	✅	❌	❌	❌	❌	❌	❌	✅	✅
series-sunburst	✅	❌	❌	❌	❌	❌	❌	✅	✅
series-boxplot	❌	✅	❌	❌	❌	❌	❌	❌ (✅ if via another coord sys like grid)	❌ (✅ if via another coord sys like grid)
series-candlestick	❌	✅	❌	❌	❌	❌	❌	❌ (✅ if via another coord sys like grid)	❌ (✅ if via another coord sys like grid)
series-heatmap	❌	✅	❌	✅	❌	❌	❌	✅	✅
series-map	✅ (create a geo coord sys exclusively)	❌	❌	✅	❌	❌	❌	✅	✅
series-parallel	❌	❌	❌	❌	❌	❌	✅	❌ (✅ if via parallel coord sys)	❌ (✅ if via parallel coord sys)
series-lines	❌	✅	✅	✅	✅	❌	❌	❌ (✅ if via another coord sys like geo)	❌ (✅ if via another coord sys like geo)
series-graph	✅ (create a "view" coord sys exclusively)	✅	✅	✅	❌	❌	❌	✅	✅
series-sankey	✅	❌	❌	❌	❌	❌	❌	✅	✅
series-funnel	✅	❌	❌	❌	❌	❌	❌	✅	✅
series-gauge	✅	❌	❌	❌	❌	❌	❌	✅	✅
series-pictorialBar	❌	✅	✅	❌	❌	❌	❌	❌ (✅ if via another coord sys like grid)	❌ (✅ if via another coord sys like grid)
series-themeRiver	❌	❌	❌	❌	✅	❌	❌	❌ (✅ if via another coord sys like singleAxis)	❌ (✅ if via another coord sys like singleAxis)
series-chord	✅	✅	✅	✅	✅	❌	❌	✅	✅
title	✅	❌	❌	❌	❌	❌	❌	✅	✅
legend	✅	❌	❌	❌	❌	❌	❌	✅	✅
dataZoom	✅	❌	❌	❌	❌	❌	❌	✅	✅
visualMap	✅	❌	❌	❌	❌	❌	❌	✅	✅
toolbox	✅	❌	❌	❌	❌	❌	❌	✅	✅
timeline	✅	❌	❌	❌	❌	❌	❌	✅	✅
thumbnail	✅	❌	❌	❌	❌	❌	❌	✅	✅
See also series-line.coordinateSystemUsage.

series-line. coordinateSystemUsage = 'data'
string
Since v6.0.0
Specify how to lay out this series-line based on the specified coordinateSystem.

In most cases, there is no need to specify coordinateSystemUsage, unless the default behavior is unexpected.

Options:

'data':

Each data item of a series (e.g., each series.data[i]) is laid out separately based on the specified coordinate system. Currently no non-series component supports coordinateSystemUsage: 'data'.

'box': (Not applicable in series-line)

The entire series or component is laid out as a whole based on the specified coordinate system - that is, the overall bounding rect or basic anchor point is calculated relative to the system.

For example, a grid component can be laid out in a matrix coordinate system or a calendar coordinate system, where its layout rectangle is calculated by the specified series-line.coords in that system. See example sparkline in matrix.
For example, a pie series or a chord series can be laid out in a geo coordinate system or a cartesian2d coordinate system, where the center is calculated by the specified series-pie.coords or series-pie.center in that system. See example pie in geo.
Only a few series support both coordinateSystemUsage: 'data' and coordinateSystemUsage: 'box', such as series-graph, series-map. For examle, in this example (coordinateSystemUsage: 'data'), each node of a graph series is laid out on a matrix coordinate system, while in this example (coordinateSystemUsage: 'box'), the entire graph series is laid out within a matrix cell.

Most series only support coordinateSystemUsage: 'data' - such as series-line, series-bar, series-scatter, etc. Meanwhile, some series only support coordinateSystemUsage: 'box' - such as series-pie (example: pie in geo), series-tree, series-treemap, series-sankey, etc.

See also series-line.coordinateSystem.

series-line. coord
Arraynumberstring
Since v6.0.0
When coordinateSystemUsage is 'box', coord is used as the input to the coordinate system and calculate the layout rectangle or anchor point.

Examples: sparkline in matrix, grpah in matrix.

Note: when coordinateSystemUsage is 'data', the input of coordinate system is series.data[i] rather than this coord.

The format this coord is defined by each coordinate system, and it's the same as the second parameter of chart.convertToPixel.

series-line. xAxisIndex
number
The index of the xAxis to base on. When mutiple xAxis components exist within an ECharts instance, use this to specify the corresponding xAxis.

series-line. xAxisId = undefined
number
The id of the xAxis to base on. When mutiple xAxis components exist within an ECharts instance, use this to specify the corresponding xAxis.

series-line. yAxisIndex
number
The index of the yAxis to base on. When mutiple yAxis components exist within an ECharts instance, use this to specify the corresponding yAxis.

series-line. yAxisId = undefined
number
The index of the yAxis to base on. When mutiple yAxis components exist within an ECharts instance, use this to specify the corresponding yAxis.

series-line. polarIndex
number
The index of the polar coordinate system to base on. When mutiple polar exist within an ECharts instance, use this to specify the corresponding polar.

series-line. polarId = undefined
number
The id of the polar coordinate system to base on. When mutiple polar exist within an ECharts instance, use this to specify the corresponding polar.

series-line. singleAxisIndex
number
The index of the singleAxis coordinate system to base on. When mutiple singleAxis exist within an ECharts instance, use this to specify the corresponding singleAxis.

series-line. singleAxisId = undefined
number
The id of the singleAxis coordinate system to base on. When mutiple singleAxis exist within an ECharts instance, use this to specify the corresponding singleAxis.

series-line. symbol  = 'emptyCircle'
stringFunction
Symbol of .

Icon types provided by ECharts includes

'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'

It can be set to an image with 'image://url' , in which URL is the link to an image, or dataURI of an image.

An image URL example:

'image://http://example.website/a/b.png'
A dataURI example:

'image://data:imag
Icons can be set to arbitrary vector path via 'path://' in ECharts. As compared with a raster image, vector paths prevent jagging and blurring when scaled, and have better control over changing colors. The size of the vector icon will be adapted automatically. Refer to SVG PathData for more information about the format of the path. You may export vector paths from tools like Adobe

For example:

'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z'
If symbols needs to be different, you can set with callback function in the following format:

(value: Array|number, params: Object) => string
The first parameter value is the value in data, and the second parameter params is the rest parameters of data item.

series-line. symbolSize = 4
numberArrayFunction
symbol size. It can be set to single numbers like 10, or use an array to represent width and height. For example, [20, 10] means symbol width is 20, and height is10.

If size of symbols needs to be different, you can set with callback function in the following format:

(value: Array|number, params: Object) => number|Array
The first parameter value is the value in data, and the second parameter params is the rest parameters of data item.

series-line. symbolRotate
numberFunction
Rotate degree of symbol. The negative value represents clockwise. Note that when symbol is set to be 'arrow' in markLine, symbolRotate value will be ignored, and compulsively use tangent angle.

If rotation of symbols needs to be different, you can set with callback function in the following format:

(value: Array|number, params: Object) => number
The first parameter value is the value in data, and the second parameter params is the rest parameters of data item.

Callback is supported since 4.8.0 .

series-line. symbolKeepAspect
boolean
Whether to keep aspect for symbols in the form of path://.

series-line. symbolOffset = [0, 0]
Array
Offset of symbol relative to original position. By default, symbol will be put in the center position of data. But if symbol is from user-defined vector path or image, you may not expect symbol to be in center. In this case, you may use this attribute to set offset to default position. It can be in absolute pixel value, or in relative percentage value.

For example, [0, '-50%'] means to move upside side position of symbol height. It can be used to make the arrow in the bottom to be at data position when symbol is pin.

series-line. showSymbol = true
boolean
Whether to show symbol. It would be shown during tooltip hover.

series-line. showAllSymbol = 'auto'
boolean
Only work when main axis is 'category' axis (axis.type is 'category'). Optional values:

'auto': Default value. Show all symbols if there is enough space. Otherwise follow the interval strategy with with axisLabel.interval.
true: Show all symbols.
false: Follow the interval strategy with axisLabel.interval.
series-line. legendHoverLink = true
boolean
Whether to enable highlighting chart when legend is being hovered.

series-line. stack
string
If stack the value. On the same category axis, the series with the same stack name would be put on top of each other.

See also stackStrategy on how to customize how values are stacked.

Notice: stack only supports stacking on value and log axis for now. time and category axis are not supported.

The effect of the below example could be seen through stack switching of toolbox on the top right corner:


series-line. stackStrategy = 'samesign'
string
Since v5.3.3
How to stack values if the stack property has been set. Options:

'samesign': only stack values if the value to be stacked has the same sign as the currently cumulated stacked value.
'all': stack all values, irrespective of the signs of the current or cumulative stacked value.
'positive': only stack positive values.
'negative': only stack negative values.
series-line. stackOrder = 'seriesAsc'
string
Since v6.0.0
Stack order. Optional values:

'seriesAsc' (default, stack in series order)
'seriesDesc' (reverse stack order)
Note: stackOrder should be defined for all series with the same stack name. If stackOrder is defined for only some of the series, the stack order may change unexpectedly when certain series are hidden (e.g., through legend toggle).

Not supported in polar coordinate system.

series-line. cursor = 'pointer'
string
The mouse style when mouse hovers on an element, the same as cursor property in CSS.

series-line. connectNulls
boolean
Whether to connect the line across null points.

series-line. clip = true
boolean
Since v4.4.0
If clip the overflow on the coordinate system. Clip results varies between series:

Scatter/EffectScatter：Ignore the symbols exceeds the coordinate system. Not clip the elements.
Bar：Clip all the overflowed. With bar width kept.
Line：Clip the overflowed line.
Lines: Clip all the overflowed.
Candlestick: Ignore the elements exceeds the coordinate system.
PictorialBar: Clip all the overflowed. (Supported since v5.5.0)
Custom: Clip all the olverflowed.
All these series have default value true except pictorialBar and custom series. Set it to false if you don't want to clip.

series-line. triggerLineEvent
boolean
Since v5.2.2
Whether line and area can trigger the event.

series-line. step
stringboolean
Whether to show as a step line. It can be true, false. Or 'start', 'middle', 'end'. Which will configure the turn point of step line.

See the example using different step options:


 series-line. label
Object
Text label of , to explain some data information about graphic item like value, name and so on. label is placed under itemStyle in ECharts 2.x. In ECharts 3, to make the configuration structure flatter, labelis taken to be at the same level with itemStyle, and has emphasis as itemStyle does.

 series-line.label. show
boolean
Whether to show label.

 series-line.label. position = 'top'
stringArray
Label position.

Followings are the options:

[x, y]

Use relative percentage, or absolute pixel values to represent position of label relative to top-left corner of bounding box. For example:

  // Absolute pixel values
  position: [10, 10],
  // Relative percentage
  position: ['50%', '50%']
'top'

'left'
'right'
'bottom'
'inside'
'insideLeft'
'insideRight'
'insideTop'
'insideBottom'
'insideTopLeft'
'insideBottomLeft'
'insideTopRight'
'insideBottomRight'
See: label position.

 series-line.label. distance = 5
number
Distance to the host graphic element.

It is valid only when position is string value (like 'top'、'insideRight').

See: label position.

 series-line.label. rotate
number
Rotate label, from -90 degree to 90, positive value represents rotate anti-clockwise.

See: label rotation.

 series-line.label. offset
Array
Whether to move text slightly. For example: [30, 40] means move 30 horizontally and move 40 vertically.

 series-line.label. textMargin
numberArray
Since v6.0.0
The space around the label to escape from overlapping. The unit is px.

Notice: textMargin is applied on the label's local bounding rect, that is, if there is a rotate specified on the label, apply textMargin on the non-rotated label first, and then apply the rotation.

The name is textMargin because historically the name margin has been used for a different purpose.

Examples:

// Set margin to be 5, means [5, 5, 5, 5]
textMargin: 5
// Set the top and bottom margin to be 5, and left and right margin to be 10
textMargin: [5, 10]
// Set each of the four margin separately
textMargin: [
    5,  // up
    10, // right
    5,  // down
    10, // left
]
 series-line.label. minMargin
number
Since v5.0.0
Minimal margin between labels. Used when label has layout.

minMargin conveys a similar meaning to textMargin, but with a different nuance. If unsure, just use textMargin; it basically covers minMargin and can provide a more compact layout for rotated labels in some scenarios.

TL;DR: The difference:

The minimal gap (if applicable) between two labels is label1.minMargin/2 + label2.minMargin/2, or label1.textMargin[number] + label2.textMargin[number].
If rotate is specified on a label,
minMargin: first rotate the label, forming a new rect by the min/max of x/y from the four corner points (that is a expanded bounding rect), and finally minMargin is applied on the new rect.
textMargin: first applied on the label's local bounding rect, and then rotate.
Data type: minMargin should be only number, textMargin can be number | number[] (follow CSS margin).
 series-line.label. formatter
stringFunction
Data label formatter, which supports string template and callback function. In either form, \n is supported to represent a new line.

String template

Model variation includes:

{a}: series name.
{b}: the name of a data item.
{c}: the value of a data item.
{@xxx}: the value of a dimension named 'xxx', for example, {@product} refers the value of 'product' dimension.
{@[n]}: the value of a dimension at the index of n, for example, {@[3]} refers the value at dimensions[3].
example:

formatter: '{b}: {@score}'
Callback function

Callback function is in form of:

(params: Object|Array) => string
where params is the single dataset needed by formatter, which is formed as:

{
    componentType: 'series',
    // Series type
    seriesType: string,
    // Series index in option.series
    seriesIndex: number,
    // Series name
    seriesName: string,
    // Data name, or category name
    name: string,
    // Data index in input data array
    dataIndex: number,
    // Original data as input
    data: Object,
    // Value of data. In most series it is the same as data.
    // But in some series it is some part of the data (e.g., in map, radar)
    value: number|Array|Object,
    // encoding info of coordinate system
    // Key: coord, like ('x' 'y' 'radius' 'angle')
    // value: Must be an array, not null/undefined. Contain dimension indices, like:
    // {
    //     x: [2] // values on dimension index 2 are mapped to x axis.
    //     y: [0] // values on dimension index 0 are mapped to y axis.
    // }
    encode: Object,
    // dimension names list
    dimensionNames: Array<String>,
    // data dimension index, for example 0 or 1 or 2 ...
    // Only work in `radar` series.
    dimensionIndex: number,
    // Color of data
    color: string
}
How to use encode and dimensionNames?

When the dataset is like

dataset: {
    source: [
        ['Matcha Latte', 43.3, 85.8, 93.7],
        ['Milk Tea', 83.1, 73.4, 55.1],
        ['Cheese Cocoa', 86.4, 65.2, 82.5],
        ['Walnut Brownie', 72.4, 53.9, 39.1]
    ]
}
We can get the value of the y-axis via

params.value[params.encode.y[0]]
When the dataset is like

dataset: {
    dimensions: ['product', '2015', '2016', '2017'],
    source: [
        {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
        {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
        {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
        {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
    ]
}
We can get the value of the y-axis via

params.value[params.dimensionNames[params.encode.y[0]]]
 series-line.label. color = '#fff'
Color
text color.

If set as 'inherit', the color will assigned as visual color, such as series color.

 series-line.label. fontStyle = 'normal'
string
font style.

Options are:

'normal'
'italic'
'oblique'
 series-line.label. fontWeight = 'normal'
stringnumber
font thick weight.

Options are:

'normal'
'bold'
'bolder'
'lighter'
100 | 200 | 300 | 400...
 series-line.label. fontFamily = 'sans-serif'
string
font family.

Can also be 'serif' , 'monospace', ...

 series-line.label. fontSize = 12
number
font size.

 series-line.label. align
string
Horizontal alignment of text, automatic by default.

Options are:

'left'
'center'
'right'
If align is not set in rich, align in parent level will be used. For example:

{
    align: right,
    rich: {
        a: {
            // `align` is not set, then it will be right
        }
    }
}
 series-line.label. verticalAlign
string
Vertical alignment of text, automatic by default.

Options are:

'top'
'middle'
'bottom'
If verticalAlign is not set in rich, verticalAlign in parent level will be used. For example:

{
    verticalAlign: bottom,
    rich: {
        a: {
            // `verticalAlign` is not set, then it will be bottom
        }
    }
}
 series-line.label. lineHeight
number
Line height of the text fragment.

If lineHeight is not set in rich, lineHeight in parent level will be used. For example:

{
    lineHeight: 56,
    rich: {
        a: {
            // `lineHeight` is not set, then it will be 56
        }
    }
}
 series-line.label. backgroundColor = 'transparent'
stringObject
Background color of the text fragment.

Can be color string, like '#123234', 'red', 'rgba(0,23,11,0.3)'.

Or image can be used, for example:

backgroundColor: {
    image: 'xxx/xxx.png'
    // It can be URL of a image,
    // or dataURI,
    // or HTMLImageElement,
    // or HTMLCanvasElement.
}
width or height can be specified when using background image, or auto adapted by default.

If set as 'inherit', the color will assigned as visual color, such as series color.

 series-line.label. borderColor
Color
Border color of the text fragment.

If set as 'inherit', the color will assigned as visual color, such as series color.

 series-line.label. borderWidth
number
Border width of the text fragment.

 series-line.label. borderType = 'solid'
stringnumberArray
the text fragment border type.

Possible values are:

'solid'
'dashed'
'dotted'
Since v5.0.0, it can also be a number or a number array to specify the dash array of the line. With borderDashOffset , we can make the line style more flexible.

For example：

{

borderType: [5, 10],

borderDashOffset: 5
}
 series-line.label. borderDashOffset
number
Since v5.0.0
To set the line dash offset. With borderType , we can make the line style more flexible.

Refer to MDN lineDashOffset for more details.

 series-line.label. borderRadius
number
Border radius of the text fragment.

 series-line.label. padding
numberArray
Padding of the text fragment, for example:

padding: [3, 4, 5, 6]: represents padding of [top, right, bottom, left].
padding: 4: represents padding: [4, 4, 4, 4].
padding: [3, 4]: represents padding: [3, 4, 3, 4].
Notice, width and height specifies the width and height of the content, without padding.

 series-line.label. shadowColor = 'transparent'
Color
Shadow color of the text block.

 series-line.label. shadowBlur
number
Show blur of the text block.

 series-line.label. shadowOffsetX
number
Shadow X offset of the text block.

 series-line.label. shadowOffsetY
number
Shadow Y offset of the text block.

 series-line.label. width
number
Width of text block.

 series-line.label. height
number
Height of text block.

 series-line.label. textBorderColor
Color
Stroke color of the text.

If set as 'inherit', the color will assigned as visual color, such as series color.

 series-line.label. textBorderWidth
number
Stroke line width of the text.

 series-line.label. textBorderType = 'solid'
stringnumberArray
Stroke line type of the text.

Possible values are:

'solid'
'dashed'
'dotted'
Since v5.0.0, it can also be a number or a number array to specify the dash array of the line. With textBorderDashOffset , we can make the line style more flexible.

For example：

{

textBorderType: [5, 10],

textBorderDashOffset: 5
}
 series-line.label. textBorderDashOffset
number
Since v5.0.0
To set the line dash offset. With textBorderType , we can make the line style more flexible.

Refer to MDN lineDashOffset for more details.

 series-line.label. textShadowColor = 'transparent'
Color
Shadow color of the text itself.

 series-line.label. textShadowBlur
number
Shadow blue of the text itself.

 series-line.label. textShadowOffsetX
number
Shadow X offset of the text itself.

 series-line.label. textShadowOffsetY
number
Shadow Y offset of the text itself.

 series-line.label. overflow = 'none'
string
Determine how to display the text when it's overflow. Available when width is set.

'truncate' Truncate the text and trailing with ellipsis.
'break' Break by word
'breakAll' Break by character.
 series-line.label. ellipsis = '...'
string
Ellipsis to be displayed when overflow is set to truncate.

'truncate' Truncate the overflow lines.
  series-line.label. rich
Object
"Rich text styles" can be defined in this rich property. For example:

label: {
    // Styles defined in 'rich' can be applied to some fragments
    // of text by adding some markers to those fragment, like
    // `{styleName|text content text content}`.
    // `'\n'` is the newline character.
    formatter: [
        '{a|Style "a" is applied to this snippet}'
        '{b|Style "b" is applied to this snippet}This snippet use default style{x|use style "x"}'
    ].join('\n'),

    rich: {
        a: {
            color: 'red',
            lineHeight: 10
        },
        b: {
            backgroundColor: {
                image: 'xxx/xxx.jpg'
            },
            height: 40
        },
        x: {
            fontSize: 18,
            fontFamily: 'Microsoft YaHei',
            borderColor: '#449933',
            borderRadius: 4
        },
        ...
    }
}
For more details, see Rich Text please.

Properties
{ <style_name> }
 series-line.label. richInheritPlainLabel = true
boolean
Since v6.0.0
Whether rich text inherits plain text style.

This option is just for backward compatibility.

The label.rich / textStyle.rich fontStyle, fontWeight, fontSize, fontFamily, textShadowColor, textShadowBlur, textShadowOffsetX, textShadowOffsetY are changed to inherit the corresponding plain label styles since echarts v6. You can use richInheritPlainLabel: false to restore it. For example,

option = {
    richInheritPlainLabel: false, // In most cases, this is enough.
    xxx1: {
        // Can also set it here to only control this label.
        label: {
            richInheritPlainLabel: false,
            rich: {/* ... */},
        }
    },
    xxx2: {
        textStyle: {
            richInheritPlainLabel: false,
            rich: {/* ... */},
        }
    }
}
 series-line. endLabel
Object
Since v5.0.0
Label on the end of line.

 series-line.endLabel. show
boolean
Whether to show label.

 series-line.endLabel. distance = 5
number
Distance to the host graphic element.

 series-line.endLabel. rotate
number
Rotate label, from -90 degree to 90, positive value represents rotate anti-clockwise.

See: label rotation.

 series-line.endLabel. offset
Array
Whether to move text slightly. For example: [30, 40] means move 30 horizontally and move 40 vertically.

 series-line.endLabel. textMargin
numberArray
Since v6.0.0
The space around the label to escape from overlapping. The unit is px.

Notice: textMargin is applied on the label's local bounding rect, that is, if there is a rotate specified on the label, apply textMargin on the non-rotated label first, and then apply the rotation.

The name is textMargin because historically the name margin has been used for a different purpose.

Examples:

// Set margin to be 5, means [5, 5, 5, 5]
textMargin: 5
// Set the top and bottom margin to be 5, and left and right margin to be 10
textMargin: [5, 10]
// Set each of the four margin separately
textMargin: [
    5,  // up
    10, // right
    5,  // down
    10, // left
]
 series-line.endLabel. minMargin
number
Since v5.0.0
Minimal margin between labels. Used when label has layout.

minMargin conveys a similar meaning to textMargin, but with a different nuance. If unsure, just use textMargin; it basically covers minMargin and can provide a more compact layout for rotated labels in some scenarios.

TL;DR: The difference:

The minimal gap (if applicable) between two labels is label1.minMargin/2 + label2.minMargin/2, or label1.textMargin[number] + label2.textMargin[number].
If rotate is specified on a label,
minMargin: first rotate the label, forming a new rect by the min/max of x/y from the four corner points (that is a expanded bounding rect), and finally minMargin is applied on the new rect.
textMargin: first applied on the label's local bounding rect, and then rotate.
Data type: minMargin should be only number, textMargin can be number | number[] (follow CSS margin).
 series-line.endLabel. formatter
stringFunction
Data label formatter, which supports string template and callback function. In either form, \n is supported to represent a new line.

String template

Model variation includes:

{a}: series name.
{b}: the name of a data item.
{c}: the value of a data item.
{@xxx}: the value of a dimension named 'xxx', for example, {@product} refers the value of 'product' dimension.
{@[n]}: the value of a dimension at the index of n, for example, {@[3]} refers the value at dimensions[3].
example:

formatter: '{b}: {@score}'
Callback function

Callback function is in form of:

(params: Object|Array) => string
where params is the single dataset needed by formatter, which is formed as:

{
    componentType: 'series',
    // Series type
    seriesType: string,
    // Series index in option.series
    seriesIndex: number,
    // Series name
    seriesName: string,
    // Data name, or category name
    name: string,
    // Data index in input data array
    dataIndex: number,
    // Original data as input
    data: Object,
    // Value of data. In most series it is the same as data.
    // But in some series it is some part of the data (e.g., in map, radar)
    value: number|Array|Object,
    // encoding info of coordinate system
    // Key: coord, like ('x' 'y' 'radius' 'angle')
    // value: Must be an array, not null/undefined. Contain dimension indices, like:
    // {
    //     x: [2] // values on dimension index 2 are mapped to x axis.
    //     y: [0] // values on dimension index 0 are mapped to y axis.
    // }
    encode: Object,
    // dimension names list
    dimensionNames: Array<String>,
    // data dimension index, for example 0 or 1 or 2 ...
    // Only work in `radar` series.
    dimensionIndex: number,
    // Color of data
    color: string
}
How to use encode and dimensionNames?

When the dataset is like

dataset: {
    source: [
        ['Matcha Latte', 43.3, 85.8, 93.7],
        ['Milk Tea', 83.1, 73.4, 55.1],
        ['Cheese Cocoa', 86.4, 65.2, 82.5],
        ['Walnut Brownie', 72.4, 53.9, 39.1]
    ]
}
We can get the value of the y-axis via

params.value[params.encode.y[0]]
When the dataset is like

dataset: {
    dimensions: ['product', '2015', '2016', '2017'],
    source: [
        {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
        {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
        {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
        {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
    ]
}
We can get the value of the y-axis via

params.value[params.dimensionNames[params.encode.y[0]]]
 series-line.endLabel. color = '#fff'
Color
text color.

If set as 'inherit', the color will assigned as visual color, such as series color.

 series-line.endLabel. fontStyle = 'normal'
string
font style.

Options are:

'normal'
'italic'
'oblique'
 series-line.endLabel. fontWeight = 'normal'
stringnumber
font thick weight.

Options are:

'normal'
'bold'
'bolder'
'lighter'
100 | 200 | 300 | 400...
 series-line.endLabel. fontFamily = 'sans-serif'
string
font family.

Can also be 'serif' , 'monospace', ...

 series-line.endLabel. fontSize = 12
number
font size.

 series-line.endLabel. align
string
Horizontal alignment of text, automatic by default.

Options are:

'left'
'center'
'right'
If align is not set in rich, align in parent level will be used. For example:

{
    align: right,
    rich: {
        a: {
            // `align` is not set, then it will be right
        }
    }
}
 series-line.endLabel. verticalAlign
string
Vertical alignment of text, automatic by default.

Options are:

'top'
'middle'
'bottom'
If verticalAlign is not set in rich, verticalAlign in parent level will be used. For example:

{
    verticalAlign: bottom,
    rich: {
        a: {
            // `verticalAlign` is not set, then it will be bottom
        }
    }
}
 series-line.endLabel. lineHeight
number
Line height of the text fragment.

If lineHeight is not set in rich, lineHeight in parent level will be used. For example:

{
    lineHeight: 56,
    rich: {
        a: {
            // `lineHeight` is not set, then it will be 56
        }
    }
}
 series-line.endLabel. backgroundColor = 'transparent'
stringObject
Background color of the text fragment.

Can be color string, like '#123234', 'red', 'rgba(0,23,11,0.3)'.

Or image can be used, for example:

backgroundColor: {
    image: 'xxx/xxx.png'
    // It can be URL of a image,
    // or dataURI,
    // or HTMLImageElement,
    // or HTMLCanvasElement.
}
width or height can be specified when using background image, or auto adapted by default.

If set as 'inherit', the color will assigned as visual color, such as series color.

 series-line.endLabel. borderColor
Color
Border color of the text fragment.

If set as 'inherit', the color will assigned as visual color, such as series color.

 series-line.endLabel. borderWidth
number
Border width of the text fragment.

 series-line.endLabel. borderType = 'solid'
stringnumberArray
the text fragment border type.

Possible values are:

'solid'
'dashed'
'dotted'
Since v5.0.0, it can also be a number or a number array to specify the dash array of the line. With borderDashOffset , we can make the line style more flexible.

For example：

{

borderType: [5, 10],

borderDashOffset: 5
}
 series-line.endLabel. borderDashOffset
number
Since v5.0.0
To set the line dash offset. With borderType , we can make the line style more flexible.

Refer to MDN lineDashOffset for more details.

 series-line.endLabel. borderRadius
number
Border radius of the text fragment.

 series-line.endLabel. padding
numberArray
Padding of the text fragment, for example:

padding: [3, 4, 5, 6]: represents padding of [top, right, bottom, left].
padding: 4: represents padding: [4, 4, 4, 4].
padding: [3, 4]: represents padding: [3, 4, 3, 4].
Notice, width and height specifies the width and height of the content, without padding.

 series-line.endLabel. shadowColor = 'transparent'
Color
Shadow color of the text block.

 series-line.endLabel. shadowBlur
number
Show blur of the text block.

 series-line.endLabel. shadowOffsetX
number
Shadow X offset of the text block.

 series-line.endLabel. shadowOffsetY
number
Shadow Y offset of the text block.

 series-line.endLabel. width
number
Width of text block.

 series-line.endLabel. height
number
Height of text block.

 series-line.endLabel. textBorderColor
Color
Stroke color of the text.

If set as 'inherit', the color will assigned as visual color, such as series color.

 series-line.endLabel. textBorderWidth
number
Stroke line width of the text.

 series-line.endLabel. textBorderType = 'solid'
stringnumberArray
Stroke line type of the text.

Possible values are:

'solid'
'dashed'
'dotted'
Since v5.0.0, it can also be a number or a number array to specify the dash array of the line. With textBorderDashOffset , we can make the line style more flexible.

For example：

{

textBorderType: [5, 10],

textBorderDashOffset: 5
}
 series-line.endLabel. textBorderDashOffset
number
Since v5.0.0
To set the line dash offset. With textBorderType , we can make the line style more flexible.

Refer to MDN lineDashOffset for more details.

 series-line.endLabel. textShadowColor = 'transparent'
Color
Shadow color of the text itself.

 series-line.endLabel. textShadowBlur
number
Shadow blue of the text itself.

 series-line.endLabel. textShadowOffsetX
number
Shadow X offset of the text itself.

 series-line.endLabel. textShadowOffsetY
number
Shadow Y offset of the text itself.

 series-line.endLabel. overflow = 'none'
string
Determine how to display the text when it's overflow. Available when width is set.

'truncate' Truncate the text and trailing with ellipsis.
'break' Break by word
'breakAll' Break by character.
 series-line.endLabel. ellipsis = '...'
string
Ellipsis to be displayed when overflow is set to truncate.

'truncate' Truncate the overflow lines.
  series-line.endLabel. rich
Object
"Rich text styles" can be defined in this rich property. For example:

label: {
    // Styles defined in 'rich' can be applied to some fragments
    // of text by adding some markers to those fragment, like
    // `{styleName|text content text content}`.
    // `'\n'` is the newline character.
    formatter: [
        '{a|Style "a" is applied to this snippet}'
        '{b|Style "b" is applied to this snippet}This snippet use default style{x|use style "x"}'
    ].join('\n'),

    rich: {
        a: {
            color: 'red',
            lineHeight: 10
        },
        b: {
            backgroundColor: {
                image: 'xxx/xxx.jpg'
            },
            height: 40
        },
        x: {
            fontSize: 18,
            fontFamily: 'Microsoft YaHei',
            borderColor: '#449933',
            borderRadius: 4
        },
        ...
    }
}
For more details, see Rich Text please.

Properties
{ <style_name> }
 series-line.endLabel. richInheritPlainLabel = true
boolean
Since v6.0.0
Whether rich text inherits plain text style.

This option is just for backward compatibility.

The label.rich / textStyle.rich fontStyle, fontWeight, fontSize, fontFamily, textShadowColor, textShadowBlur, textShadowOffsetX, textShadowOffsetY are changed to inherit the corresponding plain label styles since echarts v6. You can use richInheritPlainLabel: false to restore it. For example,

option = {
    richInheritPlainLabel: false, // In most cases, this is enough.
    xxx1: {
        // Can also set it here to only control this label.
        label: {
            richInheritPlainLabel: false,
            rich: {/* ... */},
        }
    },
    xxx2: {
        textStyle: {
            richInheritPlainLabel: false,
            rich: {/* ... */},
        }
    }
}
 series-line.endLabel. valueAnimation
boolean
Whether to enable text animation of value change.

 series-line. labelLine
Object
Since v5.0.0
Configuration of label guide line.

 series-line.labelLine. show
boolean
Whether to show the label guide line.

 series-line.labelLine. showAbove
boolean
Since v5.0.0
Whether to show the label guide line above the corresponding element.

 series-line.labelLine. length2
number
The length of the second segment of guide line.

 series-line.labelLine. smooth
booleannumber
Whether to smooth the guide line. It defaults to be false and can be set as true or the values from 0 to 1 which indicating the smoothness.

 series-line.labelLine. minTurnAngle
number
Since v5.0.0
Minimum turn angle between two segments of guide line to prevent unaesthetic display when angle is too small.

Can be 0 - 180 degree.

  series-line.labelLine. lineStyle
Object
Properties
{ color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
 series-line. labelLayout
ObjectFunction
Since v5.0.0
Unified layout configuration of labels.

It provide a chance to adjust the labels' (x, y) position, alignment based on the original layout each series provides.

This option can be a callback with following parameters.

// corresponding index of data
dataIndex: number
// corresponding type of data. Only available in graph, in which it can be 'node' or 'edge'
dataType?: string
// corresponding index of series
seriesIndex: number
// Displayed text of label.
text: string
// Bounding rectangle of label.
labelRect: {x: number, y: number, width: number, height: number}
// Horizontal alignment of label.
align: 'left' | 'center' | 'right'
// Vertical alignment of label.
verticalAlign: 'top' | 'middle' | 'bottom'
// Bounding rectangle of the element corresponding to.
rect: {x: number, y: number, width: number, height: number}
// Default points array of labelLine. Currently only provided in pie and funnel series.
// It's null in other series.
labelLinePoints?: number[][]
Example:

Align the labels on the right. Left 10px margin to the edge.

labelLayout(params) {
    return {
        x: params.rect.x + 10,
        y: params.rect.y + params.rect.height / 2,
        verticalAlign: 'middle',
        align: 'left'
    }
}
Set the text size based on the size of element bounding rectangle.


labelLayout(params) {
    return {
        fontSize: Math.max(params.rect.width / 10, 5)
    };
}
 series-line.labelLayout. hideOverlap
boolean
If hide the overlapped labels.

The following example shows how to hide the overlapped labels in graph automatically when zooming.


 series-line.labelLayout. moveOverlap
string
If move the overlapped labels to avoid overlapping.

Currently supported configurations:

'shiftX' Place the labels on horizontal direction sequencely, used when aligned horizontally.
'shiftY' Place the labels on vertical direction sequencely, used when aligned vertically.
The following example shows how to use moverOverlap: 'shiftY' to place the labels aligned vertically.


 series-line.labelLayout. x
numberstring
The x position of the label. Support absolute pixel values ​​or relative values ​​such as '20%'.

 series-line.labelLayout. y
numberstring
The y position of the label. Support absolute pixel values ​​or relative values ​​such as '20%'.

 series-line.labelLayout. dx
number
The pixel offset of the label in the x direction. Can be used with x.

 series-line.labelLayout. dy
number
The pixel offset of the label in the y direction. Can be used with y

 series-line.labelLayout. rotate
number
Label rotation angle.

 series-line.labelLayout. width
number
The width of displayed label. It can be used with overflow to constraint the label in a fixed width.

 series-line.labelLayout. height
number
The height of displayed label.

 series-line.labelLayout. align
string
The horizontal alignment of the label. Can be 'left', 'center', 'right'.

 series-line.labelLayout. verticalAlign
string
The vertical alignment of the label. Can be 'top', 'middle', 'bottom'.

 series-line.labelLayout. fontSize
number
The text size of the label.

 series-line.labelLayout. draggable
boolean
Whether to allow the user to adjust the position by dragging.

 series-line.labelLayout. labelLinePoints
Array
The array of the three points of the label guide line. The format is:

[[x, y], [x, y], [x, y]]
It is often used in pie charts to fine-tune the guide line that has been calculated. Usually not recommended to set it in other situations.

 series-line. itemStyle
Object
The style of the symbol point of broken line.

 series-line.itemStyle. color
ColorFunction
color. Color is taken from option.color Palette by default.

Supports setting as solid color using rgb(255,255,255), rgba(255,255,255,1), #fff, etc. Also supports setting as gradient color and pattern fill, see option.color for details

Supports callback functions, in the form of:

(params: Object) => Color
Input parameters are seriesIndex, dataIndex, data, value, and etc. of data item.

 series-line.itemStyle. borderColor = '#000'
Color
border color, whose format is similar to that of color.

 series-line.itemStyle. borderWidth
number
border width. No border when it is set to be 0.

border width. No border when it is set to be 0.

 series-line.itemStyle. borderType = 'solid'
stringnumberArray
border type.

Possible values are:

'solid'
'dashed'
'dotted'
Since v5.0.0, it can also be a number or a number array to specify the dash array of the line. With borderDashOffset , we can make the line style more flexible.

For example：

{

borderType: [5, 10],

borderDashOffset: 5
}
 series-line.itemStyle. borderDashOffset
number
Since v5.0.0
To set the line dash offset. With borderType , we can make the line style more flexible.

Refer to MDN lineDashOffset for more details.

 series-line.itemStyle. borderCap = 'butt'
string
Since v5.0.0
To specify how to draw the end points of the line. Possible values are:

'butt': The ends of lines are squared off at the endpoints.
'round': The ends of lines are rounded.
'square': The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness.
Default value is 'butt'. Refer to MDN lineCap for more details.

 series-line.itemStyle. borderJoin = 'bevel'
string
Since v5.0.0
To determine the shape used to join two line segments where they meet.

Possible values are:

'bevel': Fills an additional triangular area between the common endpoint of connected segments, and the separate outside rectangular corners of each segment.
'round': Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint of connected segments. The radius for these rounded corners is equal to the line width.
'miter': Connected segments are joined by extending their outside edges to connect at a single point, with the effect of filling an additional lozenge-shaped area. This setting is affected by the borderMiterLimit property.
Default value is 'bevel'. Refer to MDN lineJoin for more details.

 series-line.itemStyle. borderMiterLimit = 10
number
Since v5.0.0
To set the miter limit ratio. Only works when borderJoin is set as miter.

Default value is 10. Negative、0、Infinity and NaN values are ignored.

Refer to MDN miterLimit for more details.

 series-line.itemStyle. shadowBlur
number
Size of shadow blur. This attribute should be used along with shadowColor,shadowOffsetX, shadowOffsetY to set shadow to component.

For example:

{
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 10
}
 series-line.itemStyle. shadowColor
Color
Shadow color. Support same format as color.

 series-line.itemStyle. shadowOffsetX
number
Offset distance on the horizontal direction of shadow.

 series-line.itemStyle. shadowOffsetY
number
Offset distance on the vertical direction of shadow.

 series-line.itemStyle. opacity
number
Opacity of the component. Supports value from 0 to 1, and the component will not be drawn when set to 0.

  series-line.itemStyle. decal
Object
The style of the decal pattern. It works only if aria.enabled and aria.decal.show are both set to be true.

If it is set to be 'none', no decal will be used.

It works only if areaStyle is set.

Properties
{ symbol , symbolSize , symbolKeepAspect , color , backgroundColor , dashArrayX , dashArrayY , rotation , maxTileWidth , maxTileHeight }
 series-line. lineStyle
Object
Line style.

 series-line.lineStyle. color = "#000"
Color
Line color.

Supports setting as solid color using rgb(255,255,255), rgba(255,255,255,1), #fff, etc. Also supports setting as gradient color and pattern fill, see option.color for details

 series-line.lineStyle. width = 2
number
line width.

 series-line.lineStyle. type = 'solid'
stringnumberArray
line type.

Possible values are:

'solid'
'dashed'
'dotted'
Since v5.0.0, it can also be a number or a number array to specify the dash array of the line. With dashOffset , we can make the line style more flexible.

For example：

{

type: [5, 10],

dashOffset: 5
}
 series-line.lineStyle. dashOffset
number
Since v5.0.0
To set the line dash offset. With type , we can make the line style more flexible.

Refer to MDN lineDashOffset for more details.

 series-line.lineStyle. cap = 'butt'
string
Since v5.0.0
To specify how to draw the end points of the line. Possible values are:

'butt': The ends of lines are squared off at the endpoints.
'round': The ends of lines are rounded.
'square': The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness.
Default value is 'butt'. Refer to MDN lineCap for more details.

 series-line.lineStyle. join = 'bevel'
string
Since v5.0.0
To determine the shape used to join two line segments where they meet.

Possible values are:

'bevel': Fills an additional triangular area between the common endpoint of connected segments, and the separate outside rectangular corners of each segment.
'round': Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint of connected segments. The radius for these rounded corners is equal to the line width.
'miter': Connected segments are joined by extending their outside edges to connect at a single point, with the effect of filling an additional lozenge-shaped area. This setting is affected by the miterLimit property.
Default value is 'bevel'. Refer to MDN lineJoin for more details.

 series-line.lineStyle. miterLimit = 10
number
Since v5.0.0
To set the miter limit ratio. Only works when join is set as miter.

Default value is 10. Negative、0、Infinity and NaN values are ignored.

Refer to MDN miterLimit for more details.

 series-line.lineStyle. shadowBlur
number
Size of shadow blur. This attribute should be used along with shadowColor,shadowOffsetX, shadowOffsetY to set shadow to component.

For example:

{
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 10
}
 series-line.lineStyle. shadowColor
Color
Shadow color. Support same format as color.

 series-line.lineStyle. shadowOffsetX
number
Offset distance on the horizontal direction of shadow.

 series-line.lineStyle. shadowOffsetY
number
Offset distance on the vertical direction of shadow.

 series-line.lineStyle. opacity
number
Opacity of the component. Supports value from 0 to 1, and the component will not be drawn when set to 0.

 series-line. areaStyle
Object
The style of area.

 series-line.areaStyle. color = "#000"
Color
Fill color.

Supports setting as solid color using rgb(255,255,255), rgba(255,255,255,1), #fff, etc. Also supports setting as gradient color and pattern fill, see option.color for details

 series-line.areaStyle. origin = 'auto'
stringnumber
Origin position of area.

By default, the area between axis line and data will be filled. This config enables you to fill the area from data to the max or min of the axis data or a specified value.

Valid values:

'auto' to fill between axis line and data (Default)
'start' to fill between min axis value (when not inverse) and data
'end' to fill between max axis value (when not inverse) and data
number to fill between specified value and data (Since v5.3.2)
 series-line.areaStyle. shadowBlur
number
Size of shadow blur. This attribute should be used along with shadowColor,shadowOffsetX, shadowOffsetY to set shadow to component.

For example:

{
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 10
}
 series-line.areaStyle. shadowColor
Color
Shadow color. Support same format as color.

 series-line.areaStyle. shadowOffsetX
number
Offset distance on the horizontal direction of shadow.

 series-line.areaStyle. shadowOffsetY
number
Offset distance on the vertical direction of shadow.

 series-line.areaStyle. opacity = 0.7
number
Opacity of the component. Supports value from 0 to 1, and the component will not be drawn when set to 0.

 series-line. emphasis
Object
Highlight style of the graphic.

 series-line.emphasis. disabled
boolean
Since v5.3.0
Whether to disable the emphasis state.

When emphasis state is disabled. There will be no highlight effect when the mouse hovered the element, tooltip is triggered, or the legend is hovered. It can be used to improve interaction fluency when there are massive graphic elements.

 series-line.emphasis. scale = true
booleannumber
Since v5.0.0
Whether to scale to highlight the data in emphasis state. number has been supported since v5.3.2, the default scale value is 1.1.

 series-line.emphasis. focus = 'none'
string
Since v5.0.0
When the data is highlighted, whether to fade out of other data to focus the highlighted. The following configurations are supported:

'none' Do not fade out other data, it's by default.
'self' Only focus (not fade out) the element of the currently highlighted data.
'series' Focus on all elements of the series which the currently highlighted data belongs to.
Example:

emphasis: {
    focus: 'series',
    blurScope: 'coordinateSystem'
}

 series-line.emphasis. blurScope = 'coordinateSystem'
string
Since v5.0.0
The range of fade out when focus is enabled. Support the following configurations

'coordinateSystem'
'series'
'global'
  series-line.emphasis. label
Object
Properties
{ show , position , distance , rotate , offset , formatter , color , fontStyle , fontWeight , fontFamily , fontSize , align , verticalAlign , lineHeight , backgroundColor , borderColor , borderWidth , borderType , borderDashOffset , borderRadius , padding , shadowColor , shadowBlur , shadowOffsetX , shadowOffsetY , width , height , textBorderColor , textBorderWidth , textBorderType , textBorderDashOffset , textShadowColor , textShadowBlur , textShadowOffsetX , textShadowOffsetY , overflow , ellipsis , rich , richInheritPlainLabel }
  series-line.emphasis. labelLine
Object
Since v5.0.0
Configuration of label guide line.

Properties
{ show , lineStyle }
  series-line.emphasis. itemStyle
Object
Properties
{ color , borderColor , borderWidth , borderType , borderDashOffset , borderCap , borderJoin , borderMiterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
  series-line.emphasis. lineStyle
Object
Properties
{ color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
  series-line.emphasis. areaStyle
Object
Properties
{ color , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
  series-line.emphasis. endLabel
Object
Since v5.0.0
Properties
{ show , rotate , offset , formatter , color , fontStyle , fontWeight , fontFamily , fontSize , align , verticalAlign , lineHeight , backgroundColor , borderColor , borderWidth , borderType , borderDashOffset , borderRadius , padding , shadowColor , shadowBlur , shadowOffsetX , shadowOffsetY , width , height , textBorderColor , textBorderWidth , textBorderType , textBorderDashOffset , textShadowColor , textShadowBlur , textShadowOffsetX , textShadowOffsetY , overflow , ellipsis , rich , richInheritPlainLabel }
 series-line. blur
Object
Since v5.0.0
Configurations of blur state. Available when emphasis.focus is set.

  series-line.blur. label
Object
Properties
{ show , position , distance , rotate , offset , formatter , color , fontStyle , fontWeight , fontFamily , fontSize , align , verticalAlign , lineHeight , backgroundColor , borderColor , borderWidth , borderType , borderDashOffset , borderRadius , padding , shadowColor , shadowBlur , shadowOffsetX , shadowOffsetY , width , height , textBorderColor , textBorderWidth , textBorderType , textBorderDashOffset , textShadowColor , textShadowBlur , textShadowOffsetX , textShadowOffsetY , overflow , ellipsis , rich , richInheritPlainLabel }
  series-line.blur. labelLine
Object
Since v5.0.0
Configuration of label guide line.

Properties
{ show , lineStyle }
  series-line.blur. itemStyle
Object
Properties
{ color , borderColor , borderWidth , borderType , borderDashOffset , borderCap , borderJoin , borderMiterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
  series-line.blur. lineStyle
Object
Properties
{ color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
  series-line.blur. areaStyle
Object
Properties
{ color , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
  series-line.blur. endLabel
Object
Properties
{ show , rotate , offset , formatter , color , fontStyle , fontWeight , fontFamily , fontSize , align , verticalAlign , lineHeight , backgroundColor , borderColor , borderWidth , borderType , borderDashOffset , borderRadius , padding , shadowColor , shadowBlur , shadowOffsetX , shadowOffsetY , width , height , textBorderColor , textBorderWidth , textBorderType , textBorderDashOffset , textShadowColor , textShadowBlur , textShadowOffsetX , textShadowOffsetY , overflow , ellipsis , rich , richInheritPlainLabel }
 series-line. select
Object
Since v5.0.0
Configurations of select state. Available when selectedMode is set.

 series-line.select. disabled
boolean
Since v5.3.0
If data can be selected. Available when selectedMode is used. Can be used to disable selection for part of the data.

  series-line.select. label
Object
Properties
{ show , position , distance , rotate , offset , formatter , color , fontStyle , fontWeight , fontFamily , fontSize , align , verticalAlign , lineHeight , backgroundColor , borderColor , borderWidth , borderType , borderDashOffset , borderRadius , padding , shadowColor , shadowBlur , shadowOffsetX , shadowOffsetY , width , height , textBorderColor , textBorderWidth , textBorderType , textBorderDashOffset , textShadowColor , textShadowBlur , textShadowOffsetX , textShadowOffsetY , overflow , ellipsis , rich , richInheritPlainLabel }
  series-line.select. labelLine
Object
Since v5.0.0
Configuration of label guide line.

Properties
{ show , lineStyle }
  series-line.select. itemStyle
Object
Properties
{ color , borderColor , borderWidth , borderType , borderDashOffset , borderCap , borderJoin , borderMiterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
  series-line.select. lineStyle
Object
Properties
{ color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
  series-line.select. areaStyle
Object
Properties
{ color , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
  series-line.select. endLabel
Object
Properties
{ show , rotate , offset , formatter , color , fontStyle , fontWeight , fontFamily , fontSize , align , verticalAlign , lineHeight , backgroundColor , borderColor , borderWidth , borderType , borderDashOffset , borderRadius , padding , shadowColor , shadowBlur , shadowOffsetX , shadowOffsetY , width , height , textBorderColor , textBorderWidth , textBorderType , textBorderDashOffset , textShadowColor , textShadowBlur , textShadowOffsetX , textShadowOffsetY , overflow , ellipsis , rich , richInheritPlainLabel }
series-line. selectedMode
booleanstring
Since v5.0.0
Selected mode. It is disabled by default, and you may set it to be true to enable it.

Besides, it can be set to 'single', 'multiple' or 'series', for single selection, multiple selections and whole series selection.

'series' is supported since v5.3.0

series-line. smooth
booleannumber
Whether to show as smooth curve.

If is typed in boolean, then it means whether to enable smoothing. If is typed in number, valued from 0 to 1, then it means smoothness. A smaller value makes it less smooth.

Please refer to smoothMonotone to change smoothing algorithm.

series-line. smoothMonotone
string
Whether the broken line keep the monotonicity when it is smoothed. It can be set as 'x', 'y' to keep the monotonicity on x axis or y axis.

It is usually used on dual value axis.

Here are 2 examples of broken line chart with dual value axis, showing the differences when smoothMonotone is without any setting, and smoothMonotone is set as 'x'.

No setting about smoothMonotone:


It is set as 'x':


series-line. sampling
string
The downsampling strategy used when the data size is much larger than pixel size. It will improve the performance when turned on. Defaults to be turned off, indicating that all the data points will be drawn.

Options:

'lttb' Use Largest-Triangle-Three-Bucket algorithm to filter points. It will keep the trends and extremas.
'average' Use average value of filter points
'min' Use minimum value of filter points
'max' Use maximum value of filter points
'minmax' Use maximum extremum absolute value of filter points (Since v5.5.0)
'sum' Use sum of filter points
series-line. dimensions
Array
dimensions can be used to define dimension info for series.data or dataset.source.

Notice: if dataset is used, we can definite dimensions in dataset.dimensions, or provide dimension names in the first column/row of dataset.source, and not need to specify dimensions here. But if dimensions is specified here, it will be used despite the dimension definitions in dataset.

For example:

option = {
    dataset: {
        source: [
            // 'date', 'open', 'close', 'highest', 'lowest'
            [12, 44, 55, 66, 2],
            [23, 6, 16, 23, 1],
            ...
        ]
    },
    series: {
        type: 'xxx',
        // Specify name for each dimensions, which will be displayed in tooltip.
        dimensions: ['date', 'open', 'close', 'highest', 'lowest']
    }
}
series: {
    type: 'xxx',
    dimensions: [
        null,                // If you do not intent to defined this dimension, use null is fine.
        {type: 'ordinal'},   // Specify type of this dimension.
                             // 'ordinal' is always used in string.
                             // If type is not specified, echarts will guess type by data.
        {name: 'good', type: 'number'},
        'bad'                // Equals to {name: 'bad'}.
    ]
}
Each data item of dimensions can be:

string, for example, 'someName', which equals to {name: 'someName'}.
Object, where the attributes can be:
name: string.
type: string, supports:
number
float, that is, Float64Array
int, that is, Int32Array
ordinal, discrete value, which represents string generally.
time, time value, see data to check the format of time value.
displayName: string, generally used in tooltip for dimension display. If not specified, use name by default.
When dimensions is specified, the default tooltip will be displayed vertically, which is better to show dimension names. Otherwise, tooltip will displayed only value horizontally.

series-line. encode
Object
Define what is encoded to for each dimension of data. For example:

option = {
    dataset: {
        source: [
            // Each column is called a dimension.
            // There are five dimensions: 0, 1, 2, 3, 4.
            [12, 44, 55, 66, 2],
            [23, 6, 16, 23, 1],
            ...
        ]
    },
    series: {
        type: 'xxx',
        encode: {
            x: [3, 1, 5],      // Dimension 3, 1, 5 is mapped to x axis.
            y: 2,              // Dimension 2 is mapped to y axis.
            tooltip: [3, 2, 4] // Dimension 3, 2, 4 will be displayed in tooltip.
        }
    }
}
When dimensions is used to defined name for a certain dimension, encode can refer the name directly. For example:

series: {
    type: 'xxx',
    dimensions: ['date', 'open', 'close', 'highest', 'lowest'],
    encode: {
        x: 'date',
        y: ['open', 'close', 'highest', 'lowest']
    }
}
The basic structure of encode is illustrated as follows, where the left part of colon is the name of axis like 'x', 'y', 'radius', 'angle' or some special reserved names like "tooltip", "itemName" etc., and the right part of the colon is the dimension names or dimension indices (based on 0). One or more dimensions can be specified. Usually not all of mappings need to be specified, only specify needed ones.

The properties available in encode listed as follows:

// In any of the series and coordinate systems,
// these properties are available:
encode: {
    // Display dimension "product" and "score" in the tooltip.
    tooltip: ['product', 'score']
    // Set the series name as the concat of the names of dimensions[1] and dimensions[3].
    // (sometimes the dimension names are too long to type in series.name manually).
    seriesName: [1, 3],
    // Using dimensions[2] as the id of each data item. This is useful when dynamically
    // update data by `chart.setOption()`, where the new and old data item can be
    // corresponded by id, by which the appropriate animation can be performed when updating.
    itemId: 2,
    // Using dimensions[3] as the name of each data item. This is useful in charts like
    // 'pie', 'funnel', where data item name can be displayed in legend.
    itemName: 3,
    // Using dimensions[4] as the group ID for each data item. With universalTransition enabled,
    // the data items from the old option and those from the new one, if sharing a same group ID,
    // will then be matched and applied to a proper animation after `setOption` is called.
    itemGroupId: 4,
    // Using dimension[5] as the child group ID for each data item. This option is introduced to
    // make multiple levels drilldown and aggregation animation come true. See childGroupId for more.
    // Since v5.5.0
    itemChildGroupId: 5
}

// These properties only work in cartesian(grid) coordinate system:
encode: {
    // Map dimensions[1], dimensions[5] and dimension "score" to the X axis.
    x: [1, 5, 'score'],
    // Map dimensions[0] to the Y axis.
    y: 0
}

// These properties only work in polar coordinate system:
encode: {
    radius: 3,
    angle: 2,
    ...
}

// These properties only work in geo coordinate system:
encode: {
    lng: 3,
    lat: 2
}

// For some type of series that are not in any coordinate system,
// like 'pie', 'funnel' etc.:
encode: {
    value: 3
}
This is an example for encode.

Specially, in [custom series(~series-custom), some property in encode, corresponding to axis, can be set as null to make the series not controlled by the axis, that is, the series data will not be count in the extent of the axis, and the dataZoom on the axis will not filter the series.

var option = {
    xAxis: {},
    yAxis: {},
    dataZoom: [{
        xAxisIndex: 0
    }, {
        yAxisIndex: 0
    }],
    series: {
        type: 'custom',
        renderItem: function (params, api) {
            return {
                type: 'circle',
                shape: {
                    cx: 100, // x position is always 100
                    cy: api.coord([0, api.value(0)])[1],
                    r: 30
                },
                style: {
                    fill: 'blue'
                }
            };
        },
        encode: {
            // Then the series will not be controlled
            // by x axis and corresponding dataZoom.
            x: -1,
            y: 1
        },
        data: [ ... ]
    }
};
series-line. seriesLayoutBy = 'column'
string
When dataset is used, seriesLayoutBy specifies whether the column or the row of dataset is mapped to the series, namely, the series is "layout" on columns or rows. Optional values:

'column': by default, the columns of dataset are mapped the series. In this case, each column represents a dimension.
'row'：the rows of dataset are mapped to the series. In this case, each row represents a dimension.
Check this example.

series-line. datasetIndex
number
If series.data is not specified, and dataset exists, the series will use dataset. datasetIndex specifies which dataset will be used.

series-line. dataGroupId
string
A group ID assigned to all data items in the series.

This option has a lower priority than groupId, which means when groupId is specified for a certain data item the dataGroupId will be simply ignored for that data item. For more information, please see series.data.groupId.

 series-line. data
Array
Data array of series, which can be in the following forms:

Notice, if no data specified in series, and there is dataset in option, series will use the first dataset as its datasource. If data has been specified, dataset will not used.

series.datasetIndex can be used to specify other dataset.

Basically, data is represented by a two-dimension array, like the example below, where each column is named as a "dimension".

series: [{
    data: [
        // dimX   dimY   other dimensions ...
        [  3.4,    4.5,   15,   43],
        [  4.2,    2.3,   20,   91],
        [  10.8,   9.5,   30,   18],
        [  7.2,    8.8,   18,   57]
    ]
}]
In cartesian (grid), "dimX" and "dimY" correspond to xAxis and yAxis respectively.
In polar "dimX" and "dimY" correspond to radiusAxis and angleAxis respectively.
Other dimensions are optional, which can be used in other places. For example:
visualMap can map one or more dimensions to visual (color, symbol size ...).
series.symbolSize can be set as a callback function, where symbol size can be calculated by values of a certain dimension.
Values in other dimensions can be shown by tooltip.formatter or series.label.formatter.
Especially, when there is one and only one category axis (axis.type is 'category'), data can be simply be represented by a one-dimension array, like:

xAxis: {
    data: ['a', 'b', 'm', 'n']
},
series: [{
    // Each item corresponds to each item in xAxis.data.
    data: [23,  44,  55,  19]
    // In fact, it is the simplification of the format below:
    // data: [[0, 23], [1, 44], [2, 55], [3, 19]]
}]

Relationship between "value" and axis.type

When a dimension corresponds to a value axis (axis.type is 'value' or 'log'):

The value can be a number (like 12) (can also be a number in a string format, like '12').

When a dimension corresponds to a category axis (axis.type is 'category'):

The value should be the ordinal of the axis.data (based on 0), the string value of the axis.data. For example:

  xAxis: {
      type: 'category',
      data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
  },
  yAxis: {
      type: 'category',
      data: ['a', 'b', 'm', 'n', 'p', 'q']
  },
  series: [{
      data: [
          // xAxis      yAxis
          [  0,           0,    2  ], // This point is located at xAxis: 'Monday', yAxis: 'a'.
          [  'Thursday',  2,    1  ], // This point is located at xAxis: 'Thursday', yAxis: 'm'.
          [  2,          'p',   2  ], // This point is located at xAxis: 'Wednesday', yAxis: 'p'.
          [  3,           3,    5  ]
      ]
  }]
There is an example of double category axes: Github Punchcard.

When a dimension corresponds to a time axis (type is 'time'), the value can be:

a timestamp, like 1484141700832, which represents a UTC time.
a date string, in one of the formats below:
a subset of ISO 8601, only including (all of these are treated as local time unless timezone is specified, which is consistent with moment):
only part of year/month/date/time are specified: '2012-03', '2012-03-01', '2012-03-01 05', '2012-03-01 05:06'.
separated by "T" or a space: '2012-03-01T12:22:33.123', '2012-03-01 12:22:33.123'.
timezone specified: '2012-03-01T12:22:33Z', '2012-03-01T12:22:33+8000', '2012-03-01T12:22:33-05:00'.
other date string format (all of these are treated as local time): '2012', '2012-3-1', '2012/3/1', '2012/03/01', '2009/6/12 2:00', '2009/6/12 2:05:08', '2009/6/12 2:05:08.123'.
a JavaScript Date instance created by user:
Caution, when using a data string to create a Date instance, browser differences and inconsistencies should be considered.
For example: In chrome, new Date('2012-01-01') is treated as a Jan 1st 2012 in UTC, while new Date('2012-1-1') and new Date('2012/01/01') are treated as Jan 1st 2012 in local timezone. In safari new Date('2012-1-1') is not supported.
So if you intent to perform new Date(dateString), it is strongly recommended to use a time parse library (e.g., moment), or use echarts.time.parse, or check this.

Customize a data item:

When needing to customize a data item, it can be set as an object, where property value represent real value. For example:

[
    12,
    24,
    {
        value: [24, 32],
        // label style, only works in this data item.
        label: {},
        // item style, only works in this data item.
        itemStyle:{}
    },
    33
]
// Or
[
    [12, 332],
    [24, 32],
    {
        value: [24, 32],
        // label style, only works in this data item.
        label: {},
        // item style, only works in this data item.
        itemStyle:{}
    },
    [33, 31]
]

Empty value:

'-' or null or undefined or NaN can be used to describe that a data item does not exist (ps：not exist does not means its value is 0).

For example, line chart can break when encounter an empty value, and scatter chart do not display graphic elements for empty values.




Properties
{ name , value , groupId , childGroupId , symbol , symbolSize , symbolRotate , symbolKeepAspect , symbolOffset , label , labelLine , itemStyle , emphasis , blur , select , tooltip }
 series-line. markPoint
Object
Mark point in a chart.

Properties
{ symbol , symbolSize , symbolRotate , symbolKeepAspect , symbolOffset , silent , label , itemStyle , emphasis , blur , data , z , animation , animationThreshold , animationDuration , animationEasing , animationDelay , animationDurationUpdate , animationEasingUpdate , animationDelayUpdate }
 series-line. markLine
Object
Use a line in the chart to illustrate.

Properties
{ silent , symbol , symbolSize , symbolOffset , precision , label , lineStyle , emphasis , blur , data , z , animation , animationThreshold , animationDuration , animationEasing , animationDelay , animationDurationUpdate , animationEasingUpdate , animationDelayUpdate }
 series-line. markArea
Object
Used to mark an area in chart. For example, mark a time interval.

Properties
{ silent , label , itemStyle , emphasis , blur , data , z , animation , animationThreshold , animationDuration , animationEasing , animationDelay , animationDurationUpdate , animationEasingUpdate , animationDelayUpdate }
series-line. zlevel
number
zlevel value of all graphical elements in Line.

zlevel is used to make layers with Canvas. Graphical elements with different zlevel values will be placed in different Canvases, which is a common optimization technique. We can put those frequently changed elements (like those with animations) to a separate zlevel. Notice that too many Canvases will increase memory cost, and should be used carefully on mobile phones to avoid crash.

Canvases with bigger zlevel will be placed on Canvases with smaller zlevel.

series-line. z = 2
number
z value of all graphical elements in Line, which controls order of drawing graphical components. Components with smaller z values may be overwritten by those with larger z values.

z has a lower priority to zlevel, and will not create new Canvas.

series-line. silent
boolean
Whether to ignore mouse events. Default value is false, for triggering and responding to mouse events.

series-line. animation = true
boolean
Whether to enable animation.

series-line. animationThreshold = 2000
number
Whether to set graphic number threshold to animation. Animation will be disabled when graphic number is larger than threshold.

series-line. animationDuration = 1000
numberFunction
Duration of the first animation, which supports callback function for different data to have different animation effect:

animationDuration: function (idx) {
    // delay for later data is larger
    return idx * 100;
}
series-line. animationEasing = linear
string
Easing method used for the first animation. Varied easing effects can be found at easing effect example.

series-line. animationDelay
numberFunction
Delay before updating the first animation, which supports callback function for different data to have different animation effect.

For example:

animationDelay: function (idx) {
    // delay for later data is larger
    return idx * 100;
}
See this example for more information.

series-line. animationDurationUpdate = 300
numberFunction
Time for animation to complete, which supports callback function for different data to have different animation effect:

animationDurationUpdate: function (idx) {
    // delay for later data is larger
    return idx * 100;
}
series-line. animationEasingUpdate = 'cubicOut'
string
Easing method used for animation.

series-line. animationDelayUpdate
numberFunction
Delay before updating animation, which supports callback function for different data to have different animation effects.

For example:

animationDelayUpdate: function (idx) {
    // delay for later data is larger
    return idx * 100;
}
See this example for more information.

 series-line. universalTransition
Object
Since v5.2.0
Configuration related to universal transition animation.

Universal Transition provides the ability to morph between any series. With this feature enabled, each time setOption, transitions between series with the same id will be automatically associated with each other.

One-to-many or many-to-one animations such as drill-down, aggregation, etc. can also be achieved by specifying data items' groupId and childGroupId.

This can be enabled directly by configuring universalTransition: true in the series. It is also possible to provide an object for more detailed configuration.

 series-line.universalTransition. enabled
boolean
Whether to enable the universal transition animation.

 series-line.universalTransition. seriesKey
stringArray
The seriesKey determines how the series to be animated is associated, it defaults to the id of the series when not configured.

Usually this is configured as a string, and transitions between series with the same seriesKey will be applied. It can also be configured as an array like the following.

seriesKey: ['male', 'female']
Configuring to an array means that all series specified by the array item will be merged into the current series when animating. For example, this configuration means that series with id or seriesKey of 'male' and 'female' will be merged into the current series.

 series-line.universalTransition. divideShape
string
divideShape determines how the elements in the current series will split into multiple elements in a one-to-many or many-to-one animation. Currently supports

'split' Split the shape into multiple shapes.
'clone' Get multiple clones from the current element.
For better results, different series will have different configurations by default, for example, scatter with smaller and more complex element uses 'clone' by default, while more regular ones like bar charts default to 'split'. You can set this to the desired splitting strategy according to the needs of your own scenario.

 series-line.universalTransition. delay
Function
(index: number, count: number) => number
Configure the animation delay for each shape in a one-to-many or many-to-one animation. Setting different animation delays can bring a more instereting animation. For example, the following code creates a staggered effect with a random delay for each shape.

delay: function (index, count) {
    return Math.random() * 1000;
}
 series-line. tooltip
Object
tooltip settings in this series.

Properties
{ position , formatter , valueFormatter , backgroundColor , borderColor , borderWidth , padding , textStyle , extraCssText }
