#!/bin/sh/env python

import sys,os

eps='/home/nolan/Dropbox/Pictures/iStockPhoto/illustration.eps'

sizes=[480, 767, 1000, 1200, 1600, 2000]
crop_heights=[2000, 2000, 1000, 1000, 1000, 1000]
crop_offsets_y=[2100, 2100, 2100, 2100, 2150, 2150]
densities=[300, 300, 300, 300, 600, 600]
crop_height=1000
crop_offset_y=2100
crop_relative_to=2000
density=300

for (size, crop_height, crop_offset_y, density) in zip(sizes, crop_heights, crop_offsets_y, densities):
    scale = 1.0 * size / crop_relative_to
    os.system('convert -density %d %s -resize %dx -crop %dx%d+0+%d  +repage images/lantern-%dw.jpg' % (density, eps, size, size, round(scale * crop_height), round(scale * crop_offset_y), size))
