ARG NODE_VERSION=24.19.0
FROM node:${NODE_VERSION}-bookworm-slim
ARG BENCHMARK_APP=koa
ENV BENCHMARK_APP=${BENCHMARK_APP} HOST=0.0.0.0 PORT=3000
WORKDIR /benchmark
COPY . .
RUN chmod +x runBenchmark.sh && find apps controls corpus -name package-lock.json -exec dirname {} \; | while read directory; do npm ci --ignore-scripts --no-audit --no-fund --prefix "$directory"; done
EXPOSE 3000
CMD ["sh", "-c", "./runBenchmark.sh $BENCHMARK_APP"]
