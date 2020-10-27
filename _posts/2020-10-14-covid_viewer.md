---
layout: post
title:  "Covid Viewer"
date:   2020-10-14 18:29
categories: jekyll update
comments: true
---

Welcome to my Covid Viewer!
You can select any country in the world to be displayed in the plots below. 
The gray bars in the background represent worldwide data. The selected country will be colored.

You can use the following tools provided by bokeh:

`Pan`: Move the plot by dragging it with your mouse. This tool is activated automatically.

`Box Zoom`: Select a section of the plot on which you want to have a closer look. Before using this tool you have to select it on the right of the plot.

`Wheel Zoom`: Use the mouse wheel to zoom into the area where your curser is currently set. Before using this tool you have to select in on the right of the plot.

`Reset`: Click this tool to reset the view.

`Hover`: Hover over the tops of the bars to display the data of this particular day for the selected country and worldwide. This tool is activated automatically.


# Confirmed Infections 

The first plot gives information about the daily confirmed infections, the second one about the total ones.
The countries in the selection menu are sorted by total infections in a descending order.

<iframe class="plot" src="/assets/infections.html"
    sandbox="allow-same-origin allow-scripts"
    width="100%"
    height="1300"
    scrolling="yes"
    seamless="seamless"
    frameborder="0">
</iframe>

# Death Cases

The first plot gives information about the daily death cases, the second one about the total ones.
The countries in the selection menu are sorted by total death cases in a descending order.

<iframe class="plot" src="/assets/deaths.html"
    sandbox="allow-same-origin allow-scripts"
    width="100%"
    height="1300"
    scrolling="yes"
    seamless="seamless"
    frameborder="0">
</iframe>

Data by <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)</a>
