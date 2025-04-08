export default function NewUsers() {
    const users = [
      {
        name: "John Doe",
        email: "johndoe@gmail.com",
        status: "Verified",
      },
      {
        name: "John Doe",
        email: "johndoe@gmail.com",
        status: "Verified",
      },
      {
        name: "John Doe",
        email: "johndoe@gmail.com",
        status: "Verified",
      },
    ]
  
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold font-[satoshi]">New Users</h2>
          <a href="#" className="text-secondary text-medium font-[satoshi]">
            View All
          </a>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#27AAE11A] text-left">
              <tr>
                <th className="px-4 py-3 text-sm text-black font-semibold">Name</th>
                <th className="px-4 py-3 text-sm text-black font-semibold">E-mail</th>
                <th className="px-4 py-3 text-sm text-black font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <a href="#" className="text-primary font-semibold">
                      {user.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-[#71FB5533] text-[#20C000] text-sm font-semibold px-4 py-2 rounded-xl">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  