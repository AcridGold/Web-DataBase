set(CMAKE_SYSTEM_NAME Emscripten)
set(CMAKE_SYSTEM_VERSION 1)

set(CMAKE_C_COMPILER "D:/NSU/MyLabs/ADDED_LIBS/emsdk/upstream/emscripten/emcc.bat")
set(CMAKE_CXX_COMPILER "D:/NSU/MyLabs/ADDED_LIBS/emsdk/upstream/emscripten/em++.bat")

set(CMAKE_EXECUTABLE_SUFFIX ".js")
set(CMAKE_CROSSCOMPILING TRUE)

set(CMAKE_C_COMPILER_WORKS 1)
set(CMAKE_CXX_COMPILER_WORKS 1)

# Флаги для линковки, а не компиляции
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -s EXPORTED_FUNCTIONS=[_add_record_js,_print_all_js,_find_by_name_js,_delete_by_passengerId_js] -s EXPORTED_RUNTIME_METHODS=[cwrap] -s ENVIRONMENT=web")