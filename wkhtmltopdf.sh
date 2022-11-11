#!/bin/bash
xvfb-run -a --server-args="-screen 0, 1024x768x24" /usr/local/bin/wkhtmltopdf_bin -q $*
