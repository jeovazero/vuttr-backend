NET_NAME="vuttr-network"
EXISTS_NETWORK=`docker network ls --format="{{ .Name }}" | grep ^${NET_NAME}`

if [ -z $EXISTS_NETWORK ]
then
  docker network create -d bridge $NET_NAME
fi

containers=`docker container ls -a --filter network=$NET_NAME -q`

if [ ${#containers} -gt 0 ]
then
  docker container stop $containers || true
fi

echo "Run mongo in network vuttr"
docker run -d \
    --network "$NET_NAME" \
    --rm=true \
    --name "mongo_host" \
    mongo

echo "Run vuttr:api in network vuttr"
docker run -d \
    --network "$NET_NAME" \
    --rm=true \
    -e MONGO_URI=mongodb://mongo_host:27017/vuttr-api \
    -p 3000:3000 \
    --name "vuttr_api" \
    vuttr:api
