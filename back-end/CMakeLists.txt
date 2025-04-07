cmake_minimum_required(VERSION 3.10)
project(notebook C)

add_executable(notebook src/notebook.c src/notebook.h)
set_target_properties(notebook PROPERTIES
        OUTPUT_NAME "notebook"
        SUFFIX ".js"
)