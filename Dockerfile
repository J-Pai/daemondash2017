FROM jpai/nodejs_basic
RUN git clone https://github.com/J-Pai/daemondash2017
RUN cd daemondash2017 && npm install
CMD cd daemondash2017 && npm start
