# Connect Four

Plays a classic Connect Four with 2 players locally. This game does not
require any component online, hence, this can be played offline on the
supported browsers.

Made by Javier Onglao

## Browser Support

Supports Chrome and Firefox. 
Tested on Firefox v. 31 (Windows) and Chrome v. 32 (Windows). 

## Instructions

To play, simply hover on the column the player wishes to drop.
To restart the game, refresh, or hit the `Rematch` button.

Game only supports window widths greater than 1090 pixels. A message
will be displayed should it be below the recommended size.

Have fun!

## Unit Test

To run the unit tests, append `?test` to the URL. Unit Testing
done through [QUnit](www.quintjs.com). Debug output is automatically
shown.

```
index.html?test
```

## Debug

If you are interested in looking at the engine checking for a winning
streak, you can enable debug by appending `?debug` to the url.
Note that unit testing already has debug on by default. Do not combine
debug and test together.

```
index.html?debug
```

## Engine Information

Engine can be modified to support more than 2 players, and a custom
grid. Moreover, it can support a different condition for winning.
Instead of having 4, there can be an `x` amount to win.

Right now, UI does not support more than 2 players. It will have to
be designed to accommodate more players in the UI. Engine 
implementation and DOM abstraction are separated (or attempted to).
This enables multiple configurations for different UI environments.

## Third Party Licenses

*jQuery*, *QUnit*
Copyright (c) 2005, 2014 jQuery Foundation, Inc.

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the 
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included 
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
OTHER DEALINGS IN THE SOFTWARE.


*Noun Project Icons*
Flag by Roman J. Sokolov from The Noun Project


Trophy by Matthew Ryan Miller from The Noun Project


*Easing Plugin*
Open source under the BSD License. 
 
Copyright © 2008 George McGinley Smith
All rights reserved.
 
Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:
 
Redistributions of source code must retain the above copyright notice, this list 
of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this 
list of conditions and the following disclaimer in the documentation and/or other 
materials provided with the distribution.
 
Neither the name of the author nor the names of contributors may be used to 
endorse or promote products derived from this software without specific prior 
written permission.
 
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
OF THE POSSIBILITY OF SUCH DAMAGE. 


*Easing Equations*
Open source under the BSD License. 
 
Copyright © 2001 Robert Penner
All rights reserved.
 
Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:
 
Redistributions of source code must retain the above copyright notice, this list of 
conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list 
of conditions and the following disclaimer in the documentation and/or other materials 
provided with the distribution.
 
Neither the name of the author nor the names of contributors may be used to endorse 
or promote products derived from this software without specific prior written permission.
 
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
OF THE POSSIBILITY OF SUCH DAMAGE. 

*Roboto Font*
Copyright 2014 Christian Robertson

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
