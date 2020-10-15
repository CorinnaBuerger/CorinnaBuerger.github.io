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

# Confirmed Infections 

The first plot gives information about the daily confirmed infections, the second one about the total ones.
The countries in the selection menu are sorted by total infections in a descending order.

{% include infections.html %}

# Death Cases

The first plot gives information about the daily death cases, the second one about the total ones.
The countries in the selection menu are sorted by total death cases in a descending order.

{% include deaths.html %}
