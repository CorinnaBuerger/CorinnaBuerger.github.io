---
layout: post
title:  "Covid Viewer"
date:   2020-10-14 18:29
categories: jekyll update
comments: true
---

Welcome to my Covid Viewer!
You can select any country in the world to be displayed in the plots below. 

You can use the following tools provided by bokeh:

`Pan`: Move the plot by dragging it with your mouse. 
This tool is activated automatically.

`Box Zoom`: Select a section of the plot on which you want to have a closer look. Before using this tool you have to activate it in the toolbar on the right.

`Wheel Zoom`: Use the mouse wheel to zoom into the area where your curser is currently set. Before using this tool you have to activate it in the toolbar on the right.

`Reset`: Click this tool to reset the view.

`Hover`: Hover over the tops of the bars to display the data of this particular day for the selected country and worldwide. This tool is activated automatically.


# Confirmed Infections 

Choose a country via the selection menu below whose confirmed infections shall be visualized in the first and second plot.
The countries in the selection menu are sorted by total infections in a descending order.
The first plot gives information about the daily confirmed infections, the second one about the total ones.

The third plot shows the five most affected countries of a certain day. Unfortunately you have to zoom in strongly, otherwise the x-axis looks very messy and is impossible to read.

<iframe class="plot" src="/assets/infections.html"
    sandbox="allow-same-origin allow-scripts"
    width="100%"
    height="1900"
    scrolling="no"
    seamless="seamless"
    frameborder="0">
</iframe>

# Death Cases

Choose a country via the selection menu below whose death cases shall be visualized in the first and second plot.
The countries in the selection menu are sorted by total death cases in a descending order.
The first plot gives information about the daily death cases, the second one about the total ones.

The third plot shows the five most affected countries of a certain day. Unfortunately you have to zoom in strongly, otherwise the x-axis looks very messy and is impossible to read.

<iframe class="plot" src="/assets/deaths.html"
    sandbox="allow-same-origin allow-scripts"
    width="100%"
    height="1900"
    scrolling="no"
    seamless="seamless"
    frameborder="0">
</iframe>

Data by <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)</a>
