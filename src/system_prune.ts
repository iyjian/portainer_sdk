import axios from 'axios'
import { program } from 'commander'

program
  .requiredOption('-h, --host <char>', 'portainer host like http://192.168.100.79:9000/api')
  .requiredOption('-u, --user <char>', 'portainer username')
  .requiredOption('-p, --password <char>', 'portainer password')
  .requiredOption('-e, --env <char>', 'portainer environment id')

program.parse()

const options = program.opts()

const client = axios.create({
  baseURL: options.host,
  timeout: 1800000,
})

async function getToken() {
  const response = await client.post('/auth', {
    username: options.user,
    password: options.password,
  })

  return response.data.jwt
}

function pruneContainers(token: string) {
  return client.post(
    `/endpoints/${options.env}/docker/images/prune`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

function pruneImages(token: string) {
  return client.post(
    `/endpoints/${options.env}/docker/containers/prune`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

async function main() {
  const token = await getToken()
  console.log(token)
  const result1 = await pruneContainers(token)
  console.log(result1.data)
  const result2 = await pruneImages(token)
  console.log(result2.data)
}

main()
